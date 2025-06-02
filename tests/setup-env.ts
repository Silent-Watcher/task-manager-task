process.env.LOG_LEVEL = 'info';
process.env.APP_ENV = 'development';
process.env.APP_PORT = 3000;
process.env.APP_HOST = 'localhost';
process.env.MONGO_HOST = '127.0.0.1';
process.env.MONGO_PORT = 27017;
process.env.MONGO_USERNAME = 'root';
process.env.MONGO_PASSWORD = '1234';
process.env.NODE_ENV = 'development';
process.env.ACCESS_TOKEN_SECRET =
	'0e3cc311252b72486911325ba8143f4a928ee36e0035b006f422a20e32223214f72e942fe2c4f84696aa26dfe59c2ef5d6a40b97e9562a4872f30bdfe04707f6';
process.env.REFRESH_TOKEN_SECRET =
	'0e3cc311252b72486911325ba8143f4a928ee36e0035b006f422a20e32223214f72e942fe2c4f84696aa26dfe59c2ef5d6a40b97e9562a4872f30bdfe04707f6';
process.env.COOKIE_SECRET =
	'0e3cc311252b72486911325ba8143f4a928ee36e0035b006f422a20e32223214f72e942fe2c4f84696aa26dfe59c2ef5d6a40b97e9562a4872f30bdfe04707f6';

process.env.RESET_PASSWORD_ROUTE = '/auth/reset-password';
process.env.LOGIN_PAGE_ROUTE = '/auth/login';
process.env.CLIENT_BASE_URL = 'http://localhost:3000';

process.env.RECAPTCHA_SECRET_KEY = 'dummy';
process.env.RECAPTCHA_SITE_KEY = 'dummy';
process.env.DEV_RECAPTCHA_AUTH = 'dummy';

process.env.MONGO_DATABASE = 'test';
process.env.MONGO_REPLICASET = 'rs0';
