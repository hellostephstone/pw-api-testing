import { test as base } from '@playwright/test'
import { RequestHandler } from '../utils/request-handler'
import { APILogger } from './logger'
import { setCustomExpectLogger } from './custom-expect'
import { config } from '../api-test.config'
import { userInfo } from 'os'

export type TestOptions = {
	api: RequestHandler
	config: typeof config
}

export const test = base.extend<TestOptions>({
	api: async ({ request }, use) => {
		const logger = new APILogger()
		setCustomExpectLogger(logger)
		const requestHandler = new RequestHandler(request, config.apiUrl, logger)
		await use(requestHandler)
	},
	config: async ({}, use) => {
		await use(config)
	},
})
