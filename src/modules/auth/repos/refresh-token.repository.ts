import type { ClientSession, PaginateModel, Types } from 'mongoose';
import { type CommandResult, unwrap } from '#app/config/db/global';
import { mongo } from '#app/config/db/mongo/mongo.condig';
import { createBaseRepository } from '#app/config/db/mongo/repository';
import {
	type RefreshToken,
	type RefreshTokenDocument,
	refreshTokenModel,
} from '../models/refresh-token.model';

/**
 * Interface defining the methods for interacting with refresh token documents in the database.
 */
export interface IRefreshTokenRepository
	extends ReturnType<
		typeof createBaseRepository<RefreshToken, RefreshTokenDocument>
	> {
	findOne(
		refreshToken: string,
		userId: Types.ObjectId,
		session?: ClientSession,
	): Promise<RefreshTokenDocument | null>;
}

const base = createBaseRepository<RefreshToken, RefreshTokenDocument>(
	refreshTokenModel,
);

const createRefreshTokenRepository = () => ({
	...base,

	async findOne(
		refreshToken: string,
		userId: Types.ObjectId,
		session?: ClientSession,
	): Promise<RefreshTokenDocument | null> {
		return unwrap(
			(await mongo.fire(() =>
				refreshTokenModel.findOne(
					{
						user: userId,
						hash: refreshToken,
					},
					null,
					{ session },
				),
			)) as CommandResult<RefreshTokenDocument | null>,
		);
	},
});

/**
 * Singleton instance of the refresh token repository.
 */
export const refreshTokenRepository = createRefreshTokenRepository();
