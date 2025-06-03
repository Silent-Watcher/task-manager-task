import dayjs from 'dayjs';
import type { NextFunction, Request, Response } from 'express';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { MONGO_STATE_MAP, mongoState } from '#app/config/db/mongo/mongo.condig';
import { type IAppService, appService } from './app.service';

const createAppController = (service: IAppService) => ({
	async checkHealth(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const mongoStatus = MONGO_STATE_MAP[mongoState];

			res.sendSuccess(httpStatus.OK, {}, 'Health report', {
				server: {
					status: 'OK',
				},
				mongo: {
					status: mongoStatus,
				},
				timestamp: dayjs().toISOString(),
			});
		} catch (error) {
			next(error);
		}
	},
	//
	renderIndexPage(req: Request, res: Response, next: NextFunction) {
		try {
			res.render('index');
		} catch (error) {
			next(error);
		}
	},
	//
	renderCreateTaskPage(req: Request, res: Response, next: NextFunction) {
		try {
			res.render('tasks/createTask');
		} catch (error) {
			next(error);
		}
	},
});

export const appController = createAppController(appService);
