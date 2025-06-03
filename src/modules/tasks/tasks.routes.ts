import { Router } from 'express';
import {
	validateBody,
	validateIdParam,
} from '#app/common/validation/dataValidation';
import { zCreateTasksDto } from './dtos/create-task.dto';
import { zUpdateTasksDto } from './dtos/update-task.dto';
import { taskController } from './tasks.controller';

const tasksRouterV1 = Router();

tasksRouterV1.get('/', taskController.getAll);

tasksRouterV1.post('/', validateBody(zCreateTasksDto), taskController.create);

tasksRouterV1
	.route('/:id')
	.all(validateIdParam)
	.delete(taskController.deleteOne)
	.put(validateBody(zUpdateTasksDto), taskController.updateOne);

export { tasksRouterV1 };
