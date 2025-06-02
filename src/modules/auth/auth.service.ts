import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { createHttpError } from '#app/common/utils/http.util';
import { logger } from '#app/common/utils/logger.util';
import { CONFIG } from '#app/config';
import type { CreateUserDto } from '../users/dtos/create-user.dto';
import type { UserDocument } from '../users/user.model';
import { userService } from '../users/user.service';
import type { IRefreshTokenRepository } from './repos/refresh-token.repository';
import { refreshTokenRepository } from './repos/refresh-token.repository';

export interface IAuthService {
	registerV1(createUserDto: CreateUserDto): Promise<{
		newUser: UserDocument;
		refreshToken: string;
		accessToken: string;
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
		const hashedPassword = await hash(password, 10);

		const session = await mongoose.startSession();
		try {
			session.startTransaction();

			const newUser = await userService.create(
				{
					email,
					password: hashedPassword,
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
});

export const authService = createAuthService(refreshTokenRepository);
