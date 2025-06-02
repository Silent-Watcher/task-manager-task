import type { ClientSession, Types, UpdateResult } from 'mongoose';
import { type CommandResult, unwrap } from '#app/config/db/global';
import { mongo } from '#app/config/db/mongo/mongo.condig';
import type { CreateUserDto } from './dtos/create-user.dto';
import type { UserDocument } from './user.model';
import { userModel } from './user.model';

/**
 * Interface defining the user repository methods for database operations.
 */
export interface IUserRepository {
	// findOneByEmail(email: string): Promise<UserDocument | null>;
	findOneByEmail(
		email: string,
		session?: ClientSession,
	): Promise<UserDocument | null>;
	findById(
		id: Types.ObjectId,
		session?: ClientSession,
	): Promise<UserDocument | null>;
	updatePassword(
		id: Types.ObjectId,
		newPassword: string,
		session?: ClientSession,
	): Promise<UpdateResult>;
	create(
		createUserDto: Pick<CreateUserDto, 'email' | 'password'>,
		session?: ClientSession,
	): Promise<UserDocument>;
}

/**
 * Factory function to create a user repository instance.
 *
 * Provides methods to interact with the user collection in the database,
 * such as finding users by email or ID and creating new users.
 */
const createUserRepository = () => ({
	async findOneByEmail(email: string): Promise<UserDocument | null> {
		return unwrap(
			(await mongo.fire(() =>
				userModel.findOne({ email }),
			)) as CommandResult<UserDocument | null>,
		);
	},

	async findById(id: Types.ObjectId): Promise<UserDocument | null> {
		return unwrap(
			(await mongo.fire(() =>
				userModel.findById(id),
			)) as CommandResult<UserDocument | null>,
		);
	},

	async create(
		createUserDto: Omit<CreateUserDto, 'confirmPassword'>,
		session?: ClientSession,
	): Promise<UserDocument> {
		return unwrap(
			(await mongo.fire(() => {
				const doc = new userModel({
					email: createUserDto.email,
					password: createUserDto.password,
				});
				return doc.save({ session });
			})) as CommandResult<UserDocument>,
		);
	},

	async updatePassword(
		id: Types.ObjectId,
		newPassword: string,
	): Promise<UpdateResult> {
		return unwrap(
			(await mongo.fire(() =>
				userModel.updateOne(
					{ _id: id },
					{
						$set: { password: newPassword },
					},
				),
			)) as CommandResult<UpdateResult>,
		);
	},
});

/**
 * Singleton instance of the user repository.
 */
export const userRepository = createUserRepository();
