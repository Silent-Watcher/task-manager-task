import { describe, expect, it } from 'vitest';
import { normalizeSort } from '#app/common/helpers/query/normalizeSort';

describe('normalizeSort helper function', () => {
	it('it should return proper sort object if input is string', () => {
		const sut = normalizeSort;
		const expected = { title: 1, createdAt: -1 };

		const actual = sut('title,-createdAt');

		expect(actual).toEqual(expected);
	});

	it('it should return proper sort object if input is a array of tuples', () => {
		const sut = normalizeSort;
		const expected = { title: 1, createdAt: -1 };

		const actual = sut(
			JSON.stringify([
				['title', '1'],
				['createdAt', '-1'],
			]),
		);

		expect(actual).toEqual(expected);
	});

	it('it should return proper sort object if input is an object', () => {
		const sut = normalizeSort;
		const expected = { title: 1, createdAt: -1 };

		const actual = sut(JSON.stringify({ title: '1', createdAt: '-1' }));

		expect(actual).toEqual(expected);
	});
});
