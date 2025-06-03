import type http from 'node:http';
import { describe, expect, it, vi } from 'vitest';

const listenMock = vi.fn();

vi.mock('http', async () => {
	const actual = await vi.importActual<typeof http>('http');
	return {
		...actual,
		createServer: vi.fn(() => ({
			listen: listenMock,
		})),
	};
});

import { runServer } from '#app/core/server';

describe('runServer', () => {
	it('should start the server on the default port', () => {
		runServer();
		expect(listenMock).toHaveBeenCalledWith('3000', expect.any(Function));
	});

	it('should start the server on a given port', () => {
		runServer('4000');
		expect(listenMock).toHaveBeenCalledWith('4000', expect.any(Function));
	});
});
