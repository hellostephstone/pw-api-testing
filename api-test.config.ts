import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env') })

const processENV = process.env.TEST_ENV
const env = processENV || 'prod'
console.log('Test environment is: ' + env)

const config = {
	apiUrl: 'https://conduit-api.bondaracademy.com/api',
	userEmail: 'pwtesttest1111@test.com',
	userPassword: 'Welcome123',
}

if (env === 'qa') {
	config.userEmail = 'pwtesttest1111@test.com', config.userPassword = 'Welcome123'
}
if (env === 'prod') {
	// if (process.env.PROD_USERNAME || process.env.PROD_PASSWORD){
	// 	throw Error(`Missing required environment variables`

	// 	)}
	config.userEmail = process.env.PROD_USERNAME as string,
	config.userPassword = process.env.PROD_PASSWORD as string
}

export { config }
