import { Schema, Types, model } from 'mongoose';
import type {
	HydratedDocument,
	InferSchemaType,
	PaginateModel,
} from 'mongoose';

import mongoosePagiante from 'mongoose-paginate-v2';

const taskSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: 'user',
			required: true,
			default: undefined,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ['pending', 'in-progress', 'done'],
			required: true,
			default: 'pending',
		},
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.plugin(mongoosePagiante);

export type Task = InferSchemaType<typeof taskSchema>;
export type TaskDocument = HydratedDocument<Task>;
export const taskModel = model('task', taskSchema) as PaginateModel<Task>;
