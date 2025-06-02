import type { ClientSession, PaginateResult } from 'mongoose';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { createHttpError } from '#app/common/utils/http.util';
import type { MongoQueryOptions } from '#app/config/db/mongo/repository';
import type { ID } from '#app/config/db/mongo/types';
import type { CreateTasksDto } from './dtos/create-task.dto';
import type { Task, TaskDocument } from './tasks.model';
import { type ITasksRepository, tasksRepository } from './tasks.repository';

export interface ITaskService {
	getAll(
		queryOptions: MongoQueryOptions<Task, TaskDocument>,
	): Promise<PaginateResult<TaskDocument> | TaskDocument[] | []>;

	create(
		data: CreateTasksDto & { user: ID },
		session?: ClientSession,
	): Promise<TaskDocument>;
}

const createTaskService = (repo: ITasksRepository) => ({
	getAll(
		queryOptions: MongoQueryOptions<Task, TaskDocument>,
	): Promise<PaginateResult<TaskDocument> | TaskDocument[] | []> {
		return repo.getAll(queryOptions);
	},
	//
	async create(
		data: CreateTasksDto & { user: ID },
		session?: ClientSession,
	): Promise<TaskDocument> {
		// check if the task title is duplicate
		const tasksExists = await repo.isExists(
			{
				user: data.user,
				title: data.title,
			},
			session,
		);
		if (tasksExists) {
			throw createHttpError(httpStatus.BAD_REQUEST, {
				code: 'BAD REQUEST',
				message: 'Task with this title already exists',
			});
		}

		return repo.create(data);
	},
});

export const taskService = createTaskService(tasksRepository);
