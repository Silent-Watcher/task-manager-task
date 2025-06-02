import { Router } from 'express';
import { authController } from './auth.controller';

const authRouterV1 = Router();

// Register Route
/**
 * @route POST /register
 * @group Authentication - Endpoints for user authentication
 * @summary Registers a new user.
 * @description
 * - Blocks the request if the user is already authenticated (`blockIfAuthenticated` middleware).
 * - Validates the request body against `zCreateUserDto`.
 * - Calls the `registerV1` controller to create a new user and issue authentication tokens.
 * @access Public
 */
authRouterV1.post('/register', authController.registerV1);

export { authRouterV1 };
