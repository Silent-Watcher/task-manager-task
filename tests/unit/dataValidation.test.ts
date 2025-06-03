import { afterEach } from 'node:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { httpStatus } from '../../src/common/helpers/httpstatus';
import {
	validateBody,
	validateIdParam,
	validateParam,
	validateQuery,
} from '../../src/common/validation/dataValidation';

const mockNext = vi.fn();

const mockResponse = () => ({
	sendError: vi.fn(),
});

beforeEach(() => {
	mockNext.mockClear();
});

afterEach(() => {
	vi.resetAllMocks();
});

describe('Validation middleware', () => {
	describe('validateBody middleware', () => {
		it('should call next on valid data', () => {
			const schema = z.object({ email: z.string().trim().email() });
			const middleware = validateBody(schema);

			const req = { body: { email: 'Alinazari@gmail.com' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).toHaveBeenCalled();
			expect(res.sendError).not.toHaveBeenCalled();
		});
		//
		it('should call res.sendError on invalid data', () => {
			const schema = z.object({ email: z.string().trim().email() });
			const middleware = validateBody(schema);

			const req = { body: { email: 'dummy' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);

			expect(res.sendError).toHaveBeenCalledExactlyOnceWith(
				httpStatus.NOT_ACCEPTABLE,
				{
					code: 'NOT ACCEPTABLE',
					message: expect.stringContaining(
						'Validation error: Invalid email at "email"',
					),
				},
			);
			expect(mockNext).not.toHaveBeenCalled();
		});
	});
	//
	describe('validateParam middleware', () => {
		it('should call next on valid data', () => {
			const schema = z.object({ lang: z.enum(['en', 'fa']) });
			const middleware = validateParam(schema);

			const req = { params: { lang: 'fa' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).toHaveBeenCalled();
			expect(res.sendError).not.toHaveBeenCalled();
		});
		//
		it('should call res.sendError on invalid data', () => {
			const schema = z.object({ lang: z.enum(['en', 'fa']) });
			const middleware = validateParam(schema);

			const req = { params: { lang: 'dummy' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).not.toHaveBeenCalled();
			expect(res.sendError).toHaveBeenCalled();
		});
	});
	//
	describe('validateQuery middleware', () => {
		it('should call next on valid data', () => {
			const schema = z.object({
				status: z.enum(['pending', 'done', 'in-progress']),
			});
			const middleware = validateQuery(schema);

			const req = { query: { status: 'done' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).toHaveBeenCalled();
			expect(res.sendError).not.toHaveBeenCalled();
		});
		//
		it('should call res.sendError on invalid data', () => {
			const schema = z.object({
				status: z.enum(['pending', 'done', 'in-progress']),
			});
			const middleware = validateQuery(schema);

			const req = { query: { status: 'dummy' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).not.toHaveBeenCalled();
			expect(res.sendError).toHaveBeenCalled();
		});
	});
	//
	describe('validateIdParam middleware', () => {
		it('should call next on valid data', () => {
			const middleware = validateIdParam;

			const req = { params: { id: '683ec451d3ee742c0b0ac453' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).toHaveBeenCalled();
			expect(res.sendError).not.toHaveBeenCalled();
		});
		//
		it('should call res.sendError on invalid data', () => {
			const middleware = validateIdParam;

			const req = { params: { id: 'dummy' } } as never;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const res = mockResponse() as any;

			middleware(req, res, mockNext);
			expect(mockNext).not.toHaveBeenCalled();
			expect(res.sendError).toHaveBeenCalled();
		});
	});
});
