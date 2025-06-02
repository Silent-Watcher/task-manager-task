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
	> {}

const base = createBaseRepository<RefreshToken, RefreshTokenDocument>(
	refreshTokenModel,
);

/**
 * Factory function to create an instance of the refresh token repository.
 *
 * Provides methods for creating and finding refresh token documents.
 *
 * @returns {{
 *   create(newRefreshToken: RefreshToken): Promise<RefreshTokenDocument>;
 *   findOne(refreshToken: string, userId: Types.ObjectId): Promise<RefreshTokenDocument>;
 * }}
 */
const createRefreshTokenRepository = () => ({
	...base,
});

/**
 * Singleton instance of the refresh token repository.
 */
export const refreshTokenRepository = createRefreshTokenRepository();
