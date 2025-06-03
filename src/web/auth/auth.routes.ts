import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from 'express';

const webAuthRouter = Router();

webAuthRouter.use((req, res, next) => {
	if (req.user) {
		res.redirect('/');
		return;
	}
	next();
});

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
