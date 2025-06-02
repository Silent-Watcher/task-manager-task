import dayjs from 'dayjs';
import type { HydratedDocument, InferSchemaType } from 'mongoose';
import { Schema, Types, model } from 'mongoose';

const passwordResetSchema = new Schema(
	{
		user: { type: Types.ObjectId, required: true, ref: 'users' },
		tokenHash: { type: String, required: true, trim: true },
		expiresAt: {
			type: Date,
			required: true,
			default: dayjs().add(5, 'minutes'),
		},
		used: { type: Boolean, required: true, default: false },
	},
	{ versionKey: false },
);

// TTL index for automatic expiration
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordReset = InferSchemaType<typeof passwordResetSchema>;
export type PasswordResetDocument = HydratedDocument<PasswordReset>;

export const passwordResetModel = model<PasswordResetDocument>(
	'password_reset',
	passwordResetSchema,
);
