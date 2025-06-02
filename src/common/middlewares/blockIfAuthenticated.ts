import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '#app/config';
import { httpStatus } from '../helpers/httpstatus';

export function blockIfAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const accessToken = req.headers.authorization?.split(' ')[1];

	if (!accessToken)
		next(); // no token, so not logged in → allow
	else {
		try {
			jwt.verify(accessToken as string, CONFIG.SECRET.ACCESS_TOKEN);
			// Token is valid → block access
			res.sendError(httpStatus.FORBIDDEN, {
				code: 'FORBIDDEN',
				message:
					'Authenticated users cannot access the login or register endpoints.',
			});
			return;
		} catch (error) {
			// expired token?
			if (error instanceof jwt.TokenExpiredError) {
				next();
				return;
			}
			// malformed / bad token?
			if (error instanceof jwt.JsonWebTokenError) {
				next();
				return;
			}
			// other unexpected errors → propagate
			next(error);
		}
	}
}
