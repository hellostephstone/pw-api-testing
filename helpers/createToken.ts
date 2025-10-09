import { RequestHandler } from '../utils/request-handler'
import { config } from '../api-test.config'
import { APILogger } from '../utils/logger'
import { request } from '@playwright/test'

export async function createToken(email: string, password: string) {
	const context = await request.newContext()
	const logger = new APILogger()
	const api = new RequestHandler(context, config.apiUrl, logger)

	try {
		const tokenResponse = await api
			.path('/users/login')
			.body({ user: { email: email, password: password } })
			.postRequest(200)
		return 'Token ' + tokenResponse.user.token
	} catch (error) {
		Error.captureStackTrace(error as Error, createToken)
		throw error
	} finally {
		await context.dispose()
	}
}
