import { Router } from 'express';
import { validateBody } from '#app/common/validation/dataValidation';
import { zCreateUserDto } from '../users/dtos/create-user.dto';
import { authController } from './auth.controller';

const authRouterV1 = Router();

authRouterV1.post(
	'/signup',
	validateBody(zCreateUserDto),
	authController.registerV1,
);

export { authRouterV1 };
