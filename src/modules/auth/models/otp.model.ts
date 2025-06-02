import dayjs from 'dayjs';
import {
	type HydratedDocument,
	type InferSchemaType,
	Schema,
	Types,
	model,
} from 'mongoose';

const otpSchema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: 'users',
			required: true,
		},
		code: {
			type: String,
			required: true,
			trim: true,
			minlength: 5,
			maxlength: 5,
			match: /^[A-Za-z0-9]{5}$/, // only alphanumeric
		},
		type: {
			type: String,
			enum: ['email_verification'],
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			default: () => dayjs().add(5, 'minutes').toDate(),
		},
		used: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false },
);

// Prevent duplicate active OTPs
otpSchema.index(
	{ userId: 1, type: 1, used: 1 },
	{ unique: true, partialFilterExpression: { used: false } },
);

// TTL index for automatic expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Otp = InferSchemaType<typeof otpSchema>;
export type OtpDocument = HydratedDocument<Otp>;

export const otpModel = model<OtpDocument>('otp', otpSchema);
