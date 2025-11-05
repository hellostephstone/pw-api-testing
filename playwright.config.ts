// playwright.config.ts
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [['html'], ['list']],
	use: {
		baseURL: 'https://conduit.bondaracademy.com',
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'api-testing',
			testDir: './tests/api-tests',
			dependencies: ['api-smoke-tests'],
		},
		{
			name: 'api-smoke-tests',
			testDir: './tests/api-tests',
			testMatch: 'example*',
		},
		{
			name: 'ui-tests',
			testDir: './tests/ui-tests',
			use: {
				defaultBrowserType: 'chromium',
			},
		},
	],
})
