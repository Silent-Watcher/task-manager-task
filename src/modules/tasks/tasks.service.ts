import type { PaginateResult } from 'mongoose';
import type { MongoQueryOptions } from '#app/config/db/mongo/repository';
import type { Task, TaskDocument } from './tasks.model';
import { type ITasksRepository, tasksRepository } from './tasks.repository';

export interface ITaskService {
	getAll(
		queryOptions: MongoQueryOptions<Task, TaskDocument>,
	): Promise<PaginateResult<TaskDocument> | TaskDocument[] | []>;
}

const createTaskService = (repo: ITasksRepository) => ({
	getAll(
		queryOptions: MongoQueryOptions<Task, TaskDocument>,
	): Promise<PaginateResult<TaskDocument> | TaskDocument[] | []> {
		return repo.getAll(queryOptions);
	},
});

export const taskService = createTaskService(tasksRepository);
