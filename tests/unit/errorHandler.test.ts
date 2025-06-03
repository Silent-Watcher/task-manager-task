import { afterEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import { handleNotFoundError } from '../../src/common/middlewares/global/errorHandler';

vi.mock('#app/config', () => ({
	CONFIG: { DEBUG: true },
}));

const mockResponse = () => ({
	sendError: vi.fn(),
});

const mockRequest = () => ({
	path: '/dummy',
	method: 'GET',
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('handleExceptions', () => {
	it('should handle 404 not found correctly', () => {
		const middleware = handleNotFoundError;
		const next = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const res = mockResponse() as any;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const req = mockRequest() as any;

		middleware(req, res, next);
		expect(next).not.toHaveBeenCalled();
		expect(res.sendError).toHaveBeenCalled();
	});
});
