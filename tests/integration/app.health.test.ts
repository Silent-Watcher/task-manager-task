import mongoose from 'mongoose';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { httpStatus } from '#app/common/helpers/httpstatus';
import { app } from '#app/core/app';

describe('GET /api/health', () => {
	//
	it('responds 200 when server is on', async () => {
		await mongoose.disconnect();

		const res = await request(app).get('/api/health');
		expect(res.status).toBe(httpStatus.OK);
		expect(res.body).toHaveProperty('message', 'Health report');
		expect(res.body.meta.server).toEqual({ status: 'OK' });
		expect(res.body.meta.mongo).toEqual({
			status: 'DISCONNECTED',
		});
	});
});
