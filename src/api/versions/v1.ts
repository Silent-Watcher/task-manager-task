import { Router } from 'express';
import { appRouterV1 } from '#app/modules/app/app.routes';

const router = Router();

router.get('/test', (req, res) => {
	res.send('test');
});

/**
 * Mounts the main app routes under `/`.
 */
router.use('/', appRouterV1);

export default router;
