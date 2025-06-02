import type { NextFunction, Request, Response } from 'express';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { CONFIG } from '#app/config';
import type { CreateUserDto } from '../users/dtos/create-user.dto';
import type { IAuthService } from './auth.service';
import { authService } from './auth.service';

const createAuthController = (service: IAuthService) => ({
	//
	async registerV1(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
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

			res.sendSuccess(
				httpStatus.CREATED,
				{
					accessToken,
					user: { _id: req.user._id, email: req.user.email },
				},
				'registeration process completed',
			);
		} catch (error) {
			next(error);
		}
	},
});

export const authController = createAuthController(authService);
