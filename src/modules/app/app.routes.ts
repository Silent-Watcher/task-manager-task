import { Router } from 'express';
import { verifyUser } from '#app/common/middlewares/verifyUser';
import { authRouterV1 } from '../auth/auth.routes';
import { appController } from './app.controller';

const appRouterV1 = Router();

/**
 * Health check endpoint.
 *
 * Responds with a 200 OK status to indicate that the server is running and healthy.
 * This can be used for monitoring or load balancer health checks.
 */
appRouterV1.get('/health', appController.checkHealth);

appRouterV1.use('/auth', authRouterV1);

appRouterV1.get('/protected', verifyUser, (req, res) => {
	res.sendSuccess(200, {
		message: 'You have access to this protected route.',
	});
});

export { appRouterV1 };
