import type { NextFunction, Request, Response } from 'express';
import { type ITaskService, taskService } from './tasks.service';

const createTaskController = (service: ITaskService) => ({
	getAll(req: Request, res: Response, next: NextFunction) {
		try {
			console.log('inside tasks getall controller');
		} catch (error) {
			next(error);
		}
	},
});

export const taskController = createTaskController(taskService);
