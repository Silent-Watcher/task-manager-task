import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.ts'],
		exclude: ['./.env.test'],
		coverage: {
			provider: 'v8',
			enabled: true,
			reporter: ['html', 'json', 'text'],
			all: true,
			include: ['src/**/*.ts'],
			exclude: [
				'src/**/*.dto.ts',
				'src/**/*.model.ts',
				'src/**/*.schema.ts',
				'src/common/types/*',
			],
		},
		environment: 'node',
		setupFiles: ['vitest.setup.ts'],
	},
	resolve: {
		alias: {
			'#app': path.resolve(process.cwd(), 'src'),
		},
		conditions: ['my-package-dev'],
	},
});
