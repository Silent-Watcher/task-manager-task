import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { hashPassword, verifyPassword } from '#app/common/helpers/hash';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { createHttpError } from '#app/common/utils/http.util';
import { logger } from '#app/common/utils/logger.util';
import { CONFIG } from '#app/config';
import type { CreateUserDto } from '../users/dtos/create-user.dto';
import type { UserDocument } from '../users/user.model';
import { userService } from '../users/user.service';
import type { LoginUserDto } from './dtos/login-user.dto';
import type { IRefreshTokenRepository } from './repos/refresh-token.repository';
import { refreshTokenRepository } from './repos/refresh-token.repository';

export interface IAuthService {
	registerV1(createUserDto: CreateUserDto): Promise<{
		newUser: UserDocument;
		refreshToken: string;
		accessToken: string;
	}>;

	loginV1(loginUserDto: LoginUserDto): Promise<{
		user: UserDocument;
		accessToken: string;
		refreshToken: string;
	}>;

	refreshTokensV1(refreshToken: string): Promise<{
		accessToken: string;
		refreshToken: string;
	}>;
}

const createAuthService = (refreshTokenRepo: IRefreshTokenRepository) => ({
	//
	async registerV1(createUserDto: CreateUserDto): Promise<{
		newUser: UserDocument;
		refreshToken: string;
		accessToken: string;
	}> {
		const { email, password } = createUserDto;
		const emailTaken = await userService.findOneByEmail(email);

		if (emailTaken) {
			throw createHttpError(httpStatus.BAD_REQUEST, {
				code: 'BAD REQUEST',
				message: 'email is already in use',
			});
		}
		const hashedPassword = hashPassword(password);

		const session = await mongoose.startSession();
		try {
			session.startTransaction();

			const newUser = await userService.create(
				{
					email,
					password: password,
				},
				session,
			);

			const accessToken = jwt.sign(
				{ userId: newUser._id },
				CONFIG.SECRET.ACCESS_TOKEN,
				{ expiresIn: '5m' },
			);

			const refreshToken = jwt.sign(
				{ userId: newUser._id },
				CONFIG.SECRET.REFRESH_TOKEN,
				{ expiresIn: '1d' },
			);

			await refreshTokenRepo.create(
				{
					hash: refreshToken,
					rootIssuedAt: dayjs().toDate(),
					user: newUser._id,
				},
				session,
			);
			await session.commitTransaction();

			return {
				newUser,
				accessToken,
				refreshToken,
			};
		} catch (error) {
			await session.abortTransaction();
			logger.error(
				`Transaction aborted due to: ${(error as Error)?.message}`,
			);
			throw createHttpError(httpStatus.INTERNAL_SERVER_ERROR, {
				code: 'INTERNAL SERVER ERROR',
				message: 'Transaction failed',
			});
		} finally {
			await session.endSession();
		}
	},
	//
	async loginV1(loginUserDto: LoginUserDto): Promise<{
		user: UserDocument;
		accessToken: string;
		refreshToken: string;
	}> {
		const { email, password } = loginUserDto;
		const foundedUser = await userService.findOneByEmail(email);
		if (!foundedUser) {
			throw createHttpError(httpStatus.BAD_REQUEST, {
				code: 'BAD REQUEST',
				message: 'invalid credentials',
			});
		}

		const isPasswordValid = verifyPassword(password, foundedUser.password);
		if (!isPasswordValid) {
			throw createHttpError(httpStatus.BAD_REQUEST, {
				code: 'BAD REQUEST',
				message: 'invalid credentials',
			});
		}
		const newAccessToken = jwt.sign(
			{ userId: foundedUser._id },
			CONFIG.SECRET.ACCESS_TOKEN,
			{ expiresIn: '5m' },
		);

		const newRefreshToken = jwt.sign(
			{ userId: foundedUser._id },
			CONFIG.SECRET.REFRESH_TOKEN,
			{ expiresIn: '1d' },
		);

		await refreshTokenRepo.create({
			user: foundedUser._id,
			hash: newRefreshToken,
			rootIssuedAt: dayjs().toDate(),
		});

		return {
			user: foundedUser,
			refreshToken: newRefreshToken,
			accessToken: newAccessToken,
		};
	},
	//
	async refreshTokensV1(refreshToken: string) {
		const now = dayjs();

		const decoded = jwt.verify(
			refreshToken,
			CONFIG.SECRET.REFRESH_TOKEN,
		) as jwt.JwtPayload;

		const userId = decoded.userId;

		const doc = await refreshTokenRepo.findOne(refreshToken, userId);

		if (!doc) {
			throw createHttpError(httpStatus.UNAUTHORIZED, {
				code: 'UNAUTHORIZED',
				message: 'invalid token',
			});
		}

		// Reuse detection
		if (doc.status === 'invalid') {
			await doc.updateOne({ revokedAt: now.toDate() });
			throw createHttpError(httpStatus.UNAUTHORIZED, {
				code: 'UNAUTHORIZED',
				message: 'Reuse detected, please log in',
			});
		}

		// Sliding expiration check
		if (now.isAfter(doc.expiresAt)) {
			await doc.updateOne({ status: 'invalid' });
			throw createHttpError(httpStatus.UNAUTHORIZED, {
				code: 'UNAUTHORIZED',
				message: 'Refresh token expired, please log in',
			});
		}

		// Absolute expiration check
		if (
			now.diff(dayjs(doc.rootIssuedAt), 'day') >= CONFIG.MAX_SESSION_DAYS
		) {
			await doc.updateOne({ status: 'invalid' });
			throw createHttpError(httpStatus.UNAUTHORIZED, {
				code: 'UNAUTHORIZED',
				message: 'Session expired, please log in',
			});
		}

		const session = await mongoose.startSession();
		try {
			session.startTransaction();

			// Rotate: invalidate old and issue new
			await doc.updateOne({ status: 'invalid' }, { session });

			const newAccessToken = jwt.sign(
				{ userId },
				CONFIG.SECRET.ACCESS_TOKEN,
				{ expiresIn: '5m' },
			);

			const newRefreshToken = jwt.sign(
				{ userId },
				CONFIG.SECRET.REFRESH_TOKEN,
				{ expiresIn: '1d' },
			);

			await refreshTokenRepo.create(
				{
					user: userId,
					hash: newRefreshToken,
					rootIssuedAt: doc.rootIssuedAt,
				},
				session,
			);

			await session.commitTransaction();

			return {
				refreshToken: newRefreshToken,
				accessToken: newAccessToken,
			};
		} catch (error) {
			await session.abortTransaction();
			logger.error(
				`Transaction aborted due to: ${(error as Error)?.message}`,
			);
			throw createHttpError(httpStatus.INTERNAL_SERVER_ERROR, {
				code: 'INTERNAL SERVER ERROR',
				message: 'Transaction failed',
			});
		} finally {
			await session.endSession();
		}
	},
});

export const authService = createAuthService(refreshTokenRepository);
