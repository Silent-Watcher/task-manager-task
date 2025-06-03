import dayjs from 'dayjs';
import type {
	HydratedDocument,
	InferSchemaType,
	PaginateModel,
} from 'mongoose';
import { Schema, model } from 'mongoose';
import mongoosePagiante from 'mongoose-paginate-v2';

const refreshTokenSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
		hash: { type: String, required: true, trim: true },
		issuedAt: { type: Date, required: true, default: dayjs() },
		expiresAt: {
			type: Date,
			required: true,
			default: dayjs().add(1, 'day'),
		},
		revokedAt: { type: Date, required: false, default: undefined },
		rootIssuedAt: { type: Date, required: true },
		status: { type: String, enum: ['valid', 'invalid'], default: 'valid' },
	},
	{ timestamps: false, versionKey: false },
);

refreshTokenSchema.plugin(mongoosePagiante);
export type RefreshToken = InferSchemaType<typeof refreshTokenSchema>;
export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

export const refreshTokenModel = model(
	'refresh_token',
	refreshTokenSchema,
) as PaginateModel<RefreshToken>;
