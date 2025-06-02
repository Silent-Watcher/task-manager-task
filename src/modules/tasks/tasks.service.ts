import type { ID } from '#app/config/db/mongo/types';

export interface ITaskService {
	getAll(user: ID): Promise<[]>;
}

const createTaskService = () => ({
	async getAll(user: ID): Promise<[]> {},
});

export const taskService = createTaskService();
