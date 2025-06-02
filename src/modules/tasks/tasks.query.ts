import { z } from 'zod';
import { zBaseQuerySchema } from '#app/common/helpers/query/queryparser';

export const zTasksQuerySchema = zBaseQuerySchema.extend({
	status: z.string().optional(),
});

export type TasksQuerySchema = z.infer<typeof zTasksQuerySchema>;
