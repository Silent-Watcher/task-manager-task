import { description, name, version } from 'package.json';
import { _env } from './env.config';

/**
 * Application configuration object, frozen to prevent modifications at runtime.
 *
 * @constant CONFIG
 * @type {object}
 */
export const CONFIG = Object.freeze({
	DEBUG: _env.APP_ENV === 'development',

	APP: Object.freeze({
		PORT: _env.APP_PORT,
		NAME: name,
		DESCRIPTION: description,
		VERSION: version,
		HOST: _env.APP_HOST,
		URL: `http://${_env.APP_HOST}:${_env.APP_PORT}`,
	}),

	DB: Object.freeze({
		HOST: _env.MONGO_HOST,
		PORT: _env.MONGO_PORT,
		USERNAME: _env.MONGO_USERNAME,
		PASSWORD: _env.MONGO_PASSWORD,
		REPLICASET: _env.MONGO_REPLICASET,
		DB_NAME: _env.MONGO_DATABASE,
	}),

	SECRET: Object.freeze({
		REFRESH_TOKEN: _env.REFRESH_TOKEN_SECRET,
		ACCESS_TOKEN: _env.ACCESS_TOKEN_SECRET,
		COOKIE: _env.COOKIE_SECRET,
	}),

	MAX_SESSION_DAYS: 7,

	CLIENT_BASE_URL: _env.CLIENT_BASE_URL,

	ROUTE: Object.freeze({
		RESET_PASSWORD: _env.RESET_PASSWORD_ROUTE,
		LOGIN_PAGE_ROUTE: _env.LOGIN_PAGE_ROUTE,
	}),

	RECAPTCHA: Object.freeze({
		SITE_KEY: _env.RECAPTCHA_SITE_KEY,
		SECRET_KEY: _env.RECAPTCHA_SECRET_KEY,
		DEV_AUTH: _env.DEV_RECAPTCHA_AUTH,
	}),
});
