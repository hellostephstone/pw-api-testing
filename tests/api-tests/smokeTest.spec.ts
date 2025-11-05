import { test } from '../../utils/fixtures'
import { expect } from '../../utils/custom-expect'
import articleRequestPayload from '../../request-objects/POST-article.json'
import { faker } from '@faker-js/faker'
import { getNewRandomArticle } from '../../utils/data-generator'

test('Get Articles', async ({ api }) => {
	const response = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200)
	await expect(response).shouldMatchSchema('articles', 'GET_articles')
	expect(response.articles.length).shouldBeLessThanOrEqual(10)
	expect(response.articlesCount).shouldEqual(10)

	const response2 = await api.path('/tags').getRequest(200)
	expect(response2.tags[0]).shouldEqual('Test')
	expect(response2.tags.length).shouldBeLessThanOrEqual(10)
})

test('Get Test Tags', async ({ api }) => {
	const response = await api.path('/tags').getRequest(200)
	await expect(response).shouldMatchSchema('tags', 'GET_tags')
	expect(response.tags[0]).shouldEqual('Test')
	expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test('Create and Delete Article', async ({ api }) => {
	const articleRequest = getNewRandomArticle()
	const createArticleResponse = await api.path('/articles').body(articleRequest).postRequest(201)
	await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
	expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
	const slugId = createArticleResponse.article.slug

	const articleResponse = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200)
	expect(articleResponse.articles[0].title).shouldEqual(articleRequest.article.title)

	await api.path(`/articles/${slugId}`).deleteRequest(204)

	const articleResponseTwo = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200)
	expect(articleResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title)
})

test('Create, Update, and Delete Article', async ({ api }) => {
	const articleTitle = faker.lorem.sentence(5)
	const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
	articleRequest.article.title = 'Test NEW Article'
	const createArticleResponse = await api.path('/articles').body(articleRequest).postRequest(201)
	expect(createArticleResponse.article.title).shouldEqual('Test NEW Article')
	const slugId = createArticleResponse.article.slug

	articleRequest.article.title = 'Test NEW Article Modified'
	const updateArticleResponse = await api.path(`/articles/${slugId}`).body(articleRequest).putRequest(200)
	expect(updateArticleResponse.article.title).shouldEqual('Test NEW Article Modified')
	const newSlugId = updateArticleResponse.article.slug

	const articleResponse = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200)
	expect(articleResponse.articles[0].title).shouldEqual('Test NEW Article Modified')

	await api.path(`/articles/${newSlugId}`).deleteRequest(204)

	const articleResponseTwo = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200)
	expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test NEW Article Modified')
})
