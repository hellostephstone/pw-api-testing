import { test, expect } from '@playwright/test'

let authToken: string

test.beforeAll('Get Token', async ({ request }) => {
	const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
		data: { user: { email: 'pwtesttest1111@test.com', password: 'Welcome123' } },
	})
	const tokenResponseJSON = await tokenResponse.json()
	authToken = 'Token ' + tokenResponseJSON.user.token
})

test('Get Test Tags', async ({ request }) => {
	const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
	const tagsResponseJSON = await tagsResponse.json()

	expect(tagsResponse.status()).toEqual(200)
	expect(tagsResponseJSON.tags[0]).toEqual('Test')
	expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
})

test('Get All Articles', async ({ request }) => {
	const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
	const articleResponseJSON = await articleResponse.json()

	expect(articleResponse.status()).toEqual(200)
	expect(articleResponseJSON.articles.length).toBeLessThanOrEqual(10)
	expect(articleResponseJSON.articlesCount).toEqual(10)
})

test('Create and Delete Article', async ({ request }) => {
	const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
		data: {
			article: {
				title: 'Test TWO',
				description: 'Test Description',
				body: 'Test Body',
				tagList: [],
			},
		},
		headers: {
			Authorization: authToken,
		},
	})

	const newArticleResponseJSON = await newArticleResponse.json()
	expect(newArticleResponse.status()).toEqual(201)
	expect(newArticleResponseJSON.article.title).toEqual('Test TWO')
	const slugId = newArticleResponseJSON.article.slug

	const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
		headers: {
			Authorization: authToken,
		},
	})
	const articleResponseJSON = await articleResponse.json()
	expect(articleResponse.status()).toEqual(200)
	expect(articleResponseJSON.articles[0].title).toEqual('Test TWO')

	// Delete Article
	const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
		headers: {
			Authorization: authToken,
		},
	})
	expect(deleteArticleResponse.status()).toEqual(204)
})

test('Create, Update, and Delete Article', async ({ request }) => {
	const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
		data: {
			article: {
				title: 'Test NEW Article',
				description: 'Test Description',
				body: 'Test Body',
				tagList: [],
			},
		},
		headers: {
			Authorization: authToken,
		},
	})

	const newArticleResponseJSON = await newArticleResponse.json()
	expect(newArticleResponse.status()).toEqual(201)
	expect(newArticleResponseJSON.article.title).toEqual('Test NEW Article')
	const slugId = newArticleResponseJSON.article.slug

	// Update New Article
	const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
		data: {
			article: {
				title: 'Test NEW Article Modified',
				description: 'Test Description',
				body: 'Test Body',
				tagList: [],
			},
		},
		headers: {
			Authorization: authToken,
		},
	})

	const updateArticleResponseJSON = await updateArticleResponse.json()
	expect(updateArticleResponse.status()).toEqual(200)
	expect(updateArticleResponseJSON.article.title).toEqual('Test NEW Article Modified')
	const newSlugId = updateArticleResponseJSON.article.slug

	// Validate Update Successful
	const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
		headers: {
			Authorization: authToken,
		},
	})

	const articleResponseJSON = await articleResponse.json()
	expect(articleResponse.status()).toEqual(200)
	expect(articleResponseJSON.articles[0].title).toEqual('Test NEW Article Modified')

	// Use newSlugId to Delete Article
	const deleteArticleResponse = await request.delete(
		`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`,
		{
			headers: {
				Authorization: authToken,
			},
		}
	)
	expect(deleteArticleResponse.status()).toEqual(204)
})
