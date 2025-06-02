import { Router } from 'express';
import {
	validateBody,
	validateIdParam,
} from '#app/common/validation/dataValidation';
import { zCreateTasksDto } from './dtos/create-task.dto';
import { taskController } from './tasks.controller';

const tasksRouterV1 = Router();

tasksRouterV1.get('/', taskController.getAll);

tasksRouterV1.post('/', validateBody(zCreateTasksDto), taskController.create);

tasksRouterV1.delete('/:id', validateIdParam, taskController.deleteOne);

export { tasksRouterV1 };
