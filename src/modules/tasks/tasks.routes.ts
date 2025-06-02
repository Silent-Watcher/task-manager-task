import { Router } from 'express';
import { taskController } from './tasks.controller';

const tasksRouterV1 = Router();

tasksRouterV1.get('/', taskController.getAll);

export { tasksRouterV1 };
