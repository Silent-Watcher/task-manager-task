import { Router } from 'express';
import { appController } from '#app/modules/app/app.controller';
import { webAuthRouter } from './auth/auth.routes';

const webRouter = Router();

webRouter.use('/auth', webAuthRouter);

webRouter.get('/', appController.renderIndexPage);

export { webRouter };
