import type { NextFunction, Request, Response } from 'express';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { CONFIG } from '#app/config';
import type { CreateUserDto } from '../users/dtos/create-user.dto';
import type { IAuthService } from './auth.service';
import { authService } from './auth.service';
import type { LoginUserDto } from './dtos/login-user.dto';

const createAuthController = (service: IAuthService) => ({
	//
	async registerV1(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			console.log('inside auth controller');
			const createUserDto = req.body as CreateUserDto;
			const { newUser, refreshToken, accessToken } =
				await service.registerV1(createUserDto);

			res.cookie('refresh_token', refreshToken, {
				httpOnly: true,
				secure: !CONFIG.DEBUG,
				sameSite: 'strict',
				maxAge: 23 * 60 * 60 * 1000, // slightly lower to prevent race condition
				path: '/api/auth/refresh',
			});

			req.user = newUser;
			console.log('after register ...');
			res.sendSuccess(
				httpStatus.CREATED,
				{
					accessToken,
					user: { _id: req.user._id, email: req.user.email },
				},
				'registeration process completed',
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
	//
	async loginV1(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const loginUserDto = req.body as LoginUserDto;
			const { user, accessToken, refreshToken } =
				await service.loginV1(loginUserDto);
			const userObject = user.toObject();

			res.cookie('refresh_token', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
				secure: !CONFIG.DEBUG,
				maxAge: 23 * 60 * 60 * 1000, // slightly lower to prevent race condition
				path: '/api/auth/refresh',
			});

			req.user = user;

			res.sendSuccess(
				httpStatus.CREATED,
				{
					accessToken,
					user: { _id: req.user?._id, email: req.user?.email },
				},
				'Login successful.',
			);
			return;
		} catch (error) {
			next(error);
		}
	},
	//
	async refreshTokensV1(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const refreshToken = req.cookies.refresh_token;
			if (!refreshToken) {
				res.sendError(httpStatus.UNAUTHORIZED, {
					code: 'UNAUTHORIZED',
					message: 'refresh token not found',
				});
				return;
			}

			const {
				refreshToken: newRefreshToken,
				accessToken: newAccessToken,
			} = await service.refreshTokensV1(refreshToken);

			res.cookie('refresh_token', newRefreshToken, {
				httpOnly: true,
				secure: !CONFIG.DEBUG,
				sameSite: 'strict',
				maxAge: 23 * 60 * 60 * 1000, // slightly lower to prevent race condition
				path: '/api/auth/refresh',
			});

			res.sendSuccess(
				httpStatus.CREATED,
				{
					accessToken: newAccessToken,
				},
				'token refreshed successfully',
			);
			return;
		} catch (error) {
			next(error);
		}
	},
});

export const authController = createAuthController(authService);
