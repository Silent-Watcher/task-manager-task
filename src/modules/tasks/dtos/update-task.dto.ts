import { z } from 'zod';

export const zUpdateTasksDto = z.object({
	title: z.string().trim().nonempty('title required').optional(),
	description: z.string().trim().nonempty('body required').optional(),
	status: z.enum(['pending', 'in-progress', 'done']).optional(),
});

export type UpdateTasksDto = z.infer<typeof zUpdateTasksDto>;
