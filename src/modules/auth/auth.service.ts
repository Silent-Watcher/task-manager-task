import type { CreateUserDto } from '../users/dtos/create-user.dto';
import type { UserDocument } from '../users/user.model';
import type { IRefreshTokenRepository } from './repos/refresh-token.repository';
import { refreshTokenRepository } from './repos/refresh-token.repository';

/**
 * Interface defining the authentication service methods.
 */
export interface IAuthService {
	registerV1(createUserDto: CreateUserDto): Promise<UserDocument>;
}

const createAuthService = (refreshTokenRepo: IRefreshTokenRepository) => ({
	/**
	 * Registers a new user in the system.
	 *
	 * - Checks if the email is already taken.
	 * - Hashes the user's password securely.
	 * - Creates a new user record in the database.
	 * - Issues a new access token and refresh token for the user.
	 * - Saves the refresh token in the database for session management.
	 *
	 * @async
	 * @param {CreateUserDto} createUserDto - Data Transfer Object containing the user's email and password.
	 * @returns {Promise<{ newUser: UserDocument, accessToken: string, refreshToken: string }>}
	 * An object containing the newly created user document, a new access token, and a new refresh token.
	 * @throws {HttpError} Throws 400 Bad Request if the email is already in use.
	 */
	async registerV1(createUserDto: CreateUserDto): Promise<UserDocument> {},
});

/**
 * Singleton instance of the authentication service.
 *
 * Provides methods related to user authentication, such as registering new users
 * and refreshing access/refresh tokens.
 */
export const authService = createAuthService(refreshTokenRepository);
