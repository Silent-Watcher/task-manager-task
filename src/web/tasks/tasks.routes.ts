import { Router } from 'express';
import { appController } from '#app/modules/app/app.controller';

const webTasksRouter = Router();

webTasksRouter.get('/new', appController.renderCreateTaskPage);

export { webTasksRouter };
