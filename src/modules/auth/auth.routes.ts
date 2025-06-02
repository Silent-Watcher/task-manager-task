import { Router } from 'express';
import { blockIfAuthenticated } from '#app/common/middlewares/blockIfAuthenticated';
import { validateBody } from '#app/common/validation/dataValidation';
import { zCreateUserDto } from '../users/dtos/create-user.dto';
import { authController } from './auth.controller';
import { zLoginUserDto } from './dtos/login-user.dto';

const authRouterV1 = Router();

authRouterV1.post(
	'/signup',
	blockIfAuthenticated,
	validateBody(zCreateUserDto),
	authController.registerV1,
);

authRouterV1.post(
	'/login',
	blockIfAuthenticated,
	validateBody(zLoginUserDto),
	authController.loginV1,
);

export { authRouterV1 };
