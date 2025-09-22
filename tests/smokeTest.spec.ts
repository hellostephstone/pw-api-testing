import { appendFile } from 'fs'
import { test } from '../utils/fixtures'
import { expect } from '@playwright/test'

let authToken: string

test.beforeAll('Get Token', async ({ api }) => {
	const tokenResponse = await api
		.path('/users/login')
		.body({ user: { email: 'pwtesttest1111@test.com', password: 'Welcome123' } })
		.postRequest(200)
	authToken = 'Token ' + tokenResponse.user.token
})

test('Get Articles', async ({ api }) => {
	const response = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200)
	expect(response.articles.length).toBeLessThanOrEqual(10)
	expect(response.articlesCount).toEqual(10)
})

test('Get Test Tags', async ({ api }) => {
	const response = await api.path('/tags').getRequest(200)
	expect(response.tags[0]).toEqual('Test')
	expect(response.tags.length).toBeLessThanOrEqual(10)
})

test('Create and Delete Article', async ({ api }) => {
	const createArticleResponse = await api
		.path('/articles')
		.headers({ Authorization: authToken })
		.body({
			article: {
				title: 'Test TWO',
				description: 'Test Description',
				body: 'Test Body',
				tagList: [],
			},
		})
		.postRequest(201)

	expect(createArticleResponse.article.title).toEqual('Test TWO')
	const slugId = createArticleResponse.article.slug

	const articleResponse = await api
		.path('/articles')
		.headers({ Authorization: authToken })
		.params({ limit: 10, offset: 0 })
		.getRequest(200)
	expect(articleResponse.articles[0].title).toEqual('Test TWO')

	await api.path(`/articles/${slugId}`).headers({ Authorization: authToken }).deleteRequest(204)

	const articleResponseTwo = await api
		.path('/articles')
		.headers({ Authorization: authToken })
		.params({ limit: 10, offset: 0 })
		.getRequest(200)
	expect(articleResponseTwo.articles[0].title).not.toEqual('Test TWO')
})

test('Create, Update, and Delete Article', async ({ api }) => {
	const createArticleResponse = await api
		.path('/articles')
		.headers({ Authorization: authToken })
		.body({ article: { title: 'Test NEW Article', description: 'Test Description', body: 'Test Body', tagList: [] } })
		.postRequest(201)
	expect(createArticleResponse.article.title).toEqual('Test NEW Article')
	const slugId = createArticleResponse.article.slug

	const updateArticleResponse = await api
		.path(`/articles/${slugId}`)
		.headers({ Authorization: authToken })
		.body({
			article: { title: 'Test NEW Article Modified', description: 'Test Description', body: 'Test Body', tagList: [] },
		})
		.putRequest(200)
	expect(updateArticleResponse.article.title).toEqual('Test NEW Article Modified')
	const newSlugId = updateArticleResponse.article.slug

	const articleResponse = await api
		.path('/articles')
		.headers({ Authorization: authToken })
		.params({ limit: 10, offset: 0 })
		.getRequest(200)
	expect(articleResponse.articles[0].title).toEqual('Test NEW Article Modified')

	await api.path(`/articles/${newSlugId}`).headers({ Authorization: authToken }).deleteRequest(204)

	const articleResponseTwo = await api
		.path('/articles')
		.headers({ Authorization: authToken })
		.params({ limit: 10, offset: 0 })
		.getRequest(200)
	expect(articleResponseTwo.articles[0].title).not.toEqual('Test NEW Article Modified')
})
