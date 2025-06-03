import { Router } from 'express';
import { verifyUser } from '#app/common/middlewares/verifyUser';
import { appController } from '#app/modules/app/app.controller';
import { webAuthRouter } from './auth/auth.routes';
import { webTasksRouter } from './tasks/tasks.routes';

const webRouter = Router();

webRouter.use('/auth', webAuthRouter);
webRouter.use('/tasks', webTasksRouter);

webRouter.get('/', appController.renderIndexPage);

export { webRouter };
