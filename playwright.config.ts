import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [['html'], ['list']],
	use: {},
	projects: [
		{
			name: 'api-testing',
			testMatch: 'example*',
			dependencies: ['smoke-tests'],
		},
		{
			name: 'smoke-tests',
			// testMatch: 'smoke*',
		},
	],
})
