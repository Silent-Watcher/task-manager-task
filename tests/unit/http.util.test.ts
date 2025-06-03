import { describe, expect, it } from 'vitest';
import { httpStatus } from '../../src/common/helpers/httpstatus';
import { HttpError, createHttpError } from '../../src/common/utils/http.util';

describe('http util: createHttpError function', () => {
	it('should return an instance of the HttpError class', () => {
		const httpError = createHttpError(httpStatus.FORBIDDEN, {
			message: 'access denied',
		});

		expect(httpError).toBeInstanceOf(HttpError);
		expect(httpError.status).toBe(httpStatus.FORBIDDEN);
		expect(httpError.message).toBe('access denied');
	});
});
