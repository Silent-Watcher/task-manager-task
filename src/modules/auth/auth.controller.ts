import type { NextFunction, Request, Response } from 'express';
import type { IAuthService } from './auth.service';
import { authService } from './auth.service';

const createAuthController = (service: IAuthService) => ({
	/**
	 * Handles user registration (v1).
	 *
	 * - Receives user registration data from the request body.
	 * - Calls the service to create a new user and generate authentication tokens.
	 * - Sets a secure HTTP-only refresh token cookie.
	 * - Sends back the access token and basic user information in the response.
	 *
	 * @param {Request} req - Express request object containing the user registration data.
	 * @param {Response} res - Express response object used to send the access token and user info.
	 * @param {NextFunction} next - Express next function for error handling.
	 *
	 * @returns {Promise<void>}
	 */
	async registerV1(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			console.log();
		} catch (error) {
			next(error);
		}
	},
});

export const authController = createAuthController(authService);
