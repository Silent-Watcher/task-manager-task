import { Types } from 'mongoose';
import { describe, expect, it } from 'vitest';
import { httpStatus } from '../../src/common/helpers/httpstatus';
import { convertToObjectId } from '../../src/common/helpers/mongo';
import { HttpError } from '../../src/common/utils/http.util';

describe('covertToObjectId helper function', () => {
	it('should return a valid ObjectId when given a valid string', () => {
		const validId = new Types.ObjectId().toHexString();
		const objectId = convertToObjectId(validId);

		expect(objectId).toBeInstanceOf(Types.ObjectId);
		expect(objectId.toHexString()).toBe(validId);
	});

	it('should throw an HTTP 400 error when given an invalid ObjectId string', () => {
		const invalidId = 'dummyId';

		try {
			convertToObjectId(invalidId);
		} catch (error) {
			expect(error).toBeInstanceOf(HttpError);
			expect((error as HttpError).status).toBe(httpStatus.BAD_REQUEST);
			expect((error as HttpError).message).toBe('invalid objectID value');
		}
	});
});
