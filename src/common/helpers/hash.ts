import { type BinaryLike, pbkdf2Sync, randomBytes } from 'node:crypto';

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex');
	const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString(
		'hex',
	);
	return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
	const [salt, originalHash] = stored.split(':');
	const hash = pbkdf2Sync(
		password,
		salt as BinaryLike,
		100_000,
		64,
		'sha512',
	).toString('hex');
	return hash === originalHash;
}
