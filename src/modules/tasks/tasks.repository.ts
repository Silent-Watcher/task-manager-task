import { createBaseRepository } from '#app/config/db/mongo/repository';
import { taskModel } from './tasks.model';
import type { Task, TaskDocument } from './tasks.model';

export interface ITasksRepository
	extends ReturnType<typeof createBaseRepository<Task, TaskDocument>> {}

const base = createBaseRepository<Task, TaskDocument>(taskModel);

const createTasksRepository = () => ({
	...base,
});

export const tasksRepository = createTasksRepository();
