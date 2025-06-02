import { Router } from 'express';
import { validateBody } from '#app/common/validation/dataValidation';
import { zCreateTasksDto } from './dtos/create-task.dto';
import { taskController } from './tasks.controller';

const tasksRouterV1 = Router();

tasksRouterV1.get('/', taskController.getAll);

tasksRouterV1.post('/', validateBody(zCreateTasksDto), taskController.create);

export { tasksRouterV1 };
