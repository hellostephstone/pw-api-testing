const processENV = process.env.TEST_ENV
const env = processENV || 'qa'
console.log('Test environment is: ' + env)

const config = {
	apiUrl: 'https://conduit-api.bondaracademy.com/api',
	userEmail: 'pwtesttest1111@test.com',
	userPassword: 'Welcome123',
}

if(env === 'qa'){
    config.userEmail = 'pwtesttest1111@test.com',
	config.userPassword = 'Welcome123'
}
if(env === 'prod'){
    config.userEmail = '',
	config.userPassword = ''
}


export { config }
