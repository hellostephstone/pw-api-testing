import { test } from '../utils/fixtures'

test('first test', async ({ api }) => {
	api
		.url('https://conduit-api.bondaracademy.com/api/')
		.path('/articles')
		.params({ limit: 10, offset: 0 })
		.headers({ Authorization: 'authToken' })
		.body({ user: { email: 'pwtesttest1111@test.com', password: 'Welcome123' } })
})
