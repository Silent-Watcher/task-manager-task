import type {
	ClientSession,
	DeleteResult,
	PaginateResult,
	UpdateQuery,
} from 'mongoose';
import type { FilterQuery } from 'mongoose';
import type { UpdateResult } from 'mongoose';
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

	deleteOne(
		filter: FilterQuery<TaskDocument>,
		session?: ClientSession,
	): Promise<DeleteResult>;

	updateOne(
		filter: FilterQuery<TaskDocument>,
		changes: UpdateQuery<TaskDocument>,
		session?: ClientSession,
	): Promise<UpdateResult>;
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

	deleteOne(
		filter: FilterQuery<TaskDocument>,
		session?: ClientSession,
	): Promise<DeleteResult> {
		return repo.deleteOne(filter);
	},

	async updateOne(
		filter: FilterQuery<TaskDocument>,
		changes: UpdateQuery<TaskDocument>,
		session?: ClientSession,
	): Promise<UpdateResult> {
		// check if the task  new title is duplicate
		const tasksExists = await repo.isExists(
			{
				user: filter.user,
				title: filter.title,
			},
			session,
		);
		if (tasksExists) {
			throw createHttpError(httpStatus.BAD_REQUEST, {
				code: 'BAD REQUEST',
				message: 'Task with this title already exists',
			});
		}

		return repo.updateOne(filter, changes, session);
	},
});

export const taskService = createTaskService(tasksRepository);
