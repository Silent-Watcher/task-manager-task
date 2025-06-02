import { Router } from 'express';
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

export { appRouterV1 };
