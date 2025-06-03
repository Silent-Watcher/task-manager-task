import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from 'express';

const webAuthRouter = Router();

webAuthRouter.get(
	'/login',
	(req: Request, res: Response, next: NextFunction) => {
		res.render('auth/login');
	},
);
webAuthRouter.get(
	'/signup',
	(req: Request, res: Response, next: NextFunction) => {
		res.render('auth/signup');
	},
);

export { webAuthRouter };
