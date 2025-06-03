import { Router } from 'express';
import { appRouterV1 } from '#app/modules/app/app.routes';

const router = Router();

/**
 * Mounts the main app routes under `/`.
 */
router.use('/', appRouterV1);

export default router;
