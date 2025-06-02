import { z } from 'zod';

export const zCreateTasksDto = z.object({
	title: z.string().trim().nonempty('title required'),
	description: z.string().trim().nonempty('body required'),
	status: z.enum(['pending', 'in-progress', 'done']),
});

export type CreateTasksDto = z.infer<typeof zCreateTasksDto>;
