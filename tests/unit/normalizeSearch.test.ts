import { describe, expect, it } from 'vitest';
import { normalizeSearch } from '#app/common/helpers/query/normalizeSearch';

describe('normalizeSearch helper function', () => {
	it('should remove , from the string', () => {
		const sut = normalizeSearch;
		const input = 'sugar,"coffee shop",-late';
		const expected = 'sugar "coffee shop" -late';
		const actual = sut(input);
		expect(actual).toBe(expected);
	});
});
