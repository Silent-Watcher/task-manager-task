import type { NextFunction, Request, Response } from 'express';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { normalizeSearch } from '#app/common/helpers/query/normalizeSearch';
import { normalizeSort } from '#app/common/helpers/query/normalizeSort';
import type { ID } from '#app/config/db/mongo/types';
import type { CreateTasksDto } from './dtos/create-task.dto';
import type { UpdateTasksDto } from './dtos/update-task.dto';
import type { TasksQuerySchema } from './tasks.query';
import type { ITaskService } from './tasks.service';
import { taskService } from './tasks.service';

const createTaskController = (service: ITaskService) => ({
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, pageSize, sort, search } =
				req.query as TasksQuerySchema;

			const tasks = await service.getAll({
				filter: {
					user: req.user?._id,
				},
				populate: [{ path: 'user', select: 'email' }],
				...(search
					? { search: normalizeSearch(search as string) }
					: {}),
				...(page && pageSize ? { pagination: { page, pageSize } } : {}),
				...(sort ? { sort: { ...normalizeSort(sort) } } : {}),
			});

			res.sendSuccess(httpStatus.OK, { tasks });
			return;
		} catch (error) {
			next(error);
		}
	},
	//
	async create(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const newTaskDto = req.body as CreateTasksDto;
			const newTask = await service.create({
				user: req.user?._id as ID,
				...newTaskDto,
			});
			if (!newTask) {
				res.sendError(httpStatus.INTERNAL_SERVER_ERROR, {
					code: 'INTERNAL SERVER ERROR',
					message: 'failed to create task try again',
				});
				return;
			}

			res.sendSuccess(httpStatus.CREATED, { task: newTask });
			return;
		} catch (error) {
			next(error);
		}
	},

	async deleteOne(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const taskId = req.params?.id;
			const { deletedCount } = await service.deleteOne({
				_id: taskId,
				user: req.user?._id,
			});

			if (!deletedCount) {
				res.sendError(httpStatus.BAD_REQUEST, {
					code: 'BAD REQUEST',
					message: 'delete process failed',
				});
				return;
			}

			res.sendSuccess(httpStatus.OK, {}, 'deleted successfully');
			return;
		} catch (error) {
			next(error);
		}
	},

	async updateOne(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const taskId = req.params?.id;

			const updateNoteDto = req.body as UpdateTasksDto;

			const { modifiedCount } = await service.updateOne(
				{
					_id: taskId,
					user: req.user?._id,
				},
				updateNoteDto,
			);

			if (!modifiedCount) {
				res.sendError(httpStatus.BAD_REQUEST, {
					code: 'BAD REQUEST',
					message: 'task with this id not found',
				});
				return;
			}

			res.sendSuccess(httpStatus.OK, {}, 'updated successfully');
			return;
		} catch (error) {
			next(error);
		}
	},
});

export const taskController = createTaskController(taskService);
