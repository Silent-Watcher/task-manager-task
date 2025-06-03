import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { router as apiRouter } from '#app/api/';
import { configureMiddleware } from '#app/common/middlewares/global';
import { configureErrorHandler } from '#app/common/middlewares/global/errorHandler';
import { webRouter } from '#app/web';

export const app = express();

configureMiddleware(app);

app.use('/', webRouter);
app.use('/api', apiRouter);

configureErrorHandler(app);
