import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { levelNames, logger } from '#app/common/utils/logger.util';

/**
 * Array of valid log levels extracted from pino.levels.values.
 * Used to validate the LOG_LEVEL environment variable.
 * @constant logLevels
 * @type {[string, ...string[]]}
 */
const logLevels = levelNames as [string, ...string[]];

/**
 * Zod schema for validating environment variables.
 */
const zEnv = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']),

	APP_ENV: z.enum(['development', 'test', 'production']),
	APP_PORT: z.coerce
		.number()
		.int({ message: 'APP_PORT must be an integer' })
		.min(1, { message: 'APP_PORT must be ≥ 1' })
		.max(65535, { message: 'APP_PORT must be ≤ 65535' }),

	APP_HOST: z.string().nonempty('APP_HOST must be set'),

	MONGO_USERNAME: z
		.string()
		.nonempty({ message: 'MONGO_USERNAME is required' }),
	MONGO_PASSWORD: z
		.string()
		.nonempty({ message: 'MONGO_USERNAME is required' }),
	MONGO_HOST: z.string().nonempty({ message: 'MONGO_HOST is required' }),
	MONGO_PORT: z.coerce
		.number()
		.int({ message: 'MONGO_PORT must be an integer' })
		.min(1, { message: 'MONGO_PORT must be ≥ 1' })
		.max(65535, { message: 'MONGO_PORT must be ≤ 65535' }),

	MONGO_DATABASE: z
		.string()
		.nonempty({ message: 'MONGO_DATABASE is required' })
		.default('test'),

	MONGO_REPLICASET: z
		.string()
		.nonempty({ message: 'MONGO_REPLICASET is required' })
		.default('rs0'),

	LOG_LEVEL: z.enum(logLevels, {
		required_error: 'LOG_LEVEL is required',
		invalid_type_error: `LOG_LEVEL must be one of ${logLevels.join('/')}`,
	}),

	REFRESH_TOKEN_SECRET: z
		.string()
		.regex(
			/^[0-9a-f]{128}$/,
			'REFRESH_TOKEN_SECRET must be a 128-character hexadecimal string',
		),
	ACCESS_TOKEN_SECRET: z
		.string()
		.regex(
			/^[0-9a-f]{128}$/,
			'ACCESS_TOKEN_SECRET must be a 128-character hexadecimal string',
		),

	COOKIE_SECRET: z
		.string()
		.regex(
			/^[0-9a-f]{128}$/,
			'COOKIE_SECRET must be a 128-character hexadecimal string',
		),

	CLIENT_BASE_URL: z
		.string()
		.url({ message: 'CLIENT_BASE_URL must be a valid URL' }),

	RESET_PASSWORD_ROUTE: z
		.string()
		.startsWith('/', {
			message: 'RESET_PASSWORD_ROUTE must start with "/"',
		})
		.min(2, { message: 'RESET_PASSWORD_ROUTE is too short' }),

	LOGIN_PAGE_ROUTE: z
		.string()
		.startsWith('/', {
			message: 'LOGIN_PAGE_ROUTE must start with "/"',
		})
		.min(2, { message: 'LOGIN_PAGE_ROUTE is too short' }),

	RECAPTCHA_SITE_KEY: z.string().nonempty('RECAPTCHA_SITE_KEY is required'),
	RECAPTCHA_SECRET_KEY: z
		.string()
		.nonempty('RECAPTCHA_SECRET_KEY is required'),

	DEV_RECAPTCHA_AUTH: z.string().nonempty('DEV_RECAPTCHA_AUTH is required'),
});

/**
 * Type representing the validated environment variables.
 */
export type Env = z.infer<typeof zEnv>;

/**
 * Result of parsing and validating process.env against the zEnv schema.
 * @type {{ success: boolean; data?: Env; error?: import('zod').ZodError }}
 */
const zEnvValidationResult = zEnv.safeParse(process.env);

if (!zEnvValidationResult.success) {
	logger.error(
		`there is an error with env variables!: ${
			fromZodError(zEnvValidationResult.error).message
		}`,
	);
	process.exit(1);
}

/**
 * Validated environment variables.
 * @constant _env
 * @type {Env}
 */
export const _env = zEnvValidationResult.data;

declare global {
	namespace NodeJS {
		/**
		 * Extend NodeJS.ProcessEnv interface with validated env variables.
		 */
		interface ProcessEnv extends Env {}
	}
}
