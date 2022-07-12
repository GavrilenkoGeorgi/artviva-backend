const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helpers/user_helper')
const app = require('../app')
const api = supertest(app)

let activationUUID
let token
const loginRoute = '/api/login'
const accountRoute = '/api/users'

beforeAll((done) => {
	supertest(app)
		.post('/api/users')
		.send({
			...helper.newUser,
			teacher: null
		})
		.end((err, response) => {
			activationUUID = response.body.testUUID
			done()
		})
})

describe('User login and register logic', () => {
	test('user can\'t login with incorrect email', async () => {
		const result = await api
			.post(loginRoute)
			.send({
				email: 'incorrect@email.com',
				password: helper.newUser.password
			})
			.expect(401)

		expect(result.body.message).toContain('Невірна адреса електронної пошти або пароль')
	})

	test('user can\'t login with incorrect password', async () => {
		const result = await api
			.post(loginRoute)
			.send({
				email: helper.newUser.email,
				password: 'incorrectPassword!'
			})
			.expect(401)

		expect(result.body.message).toContain('Невірна адреса електронної пошти або пароль')
	})

	test('user can\'t login if account is not activated', async () => {
		const result = await api
			.post(loginRoute)
			.send({
				email: helper.newUser.email,
				password: helper.newUser.password
			})
			.expect(401)

		expect(result.body.message).toContain('Ви повинні активувати свій акаунт, щоб мати можливість увійти')
	})

	test('user can activate account', async () => {
		const result = await api
			.post(`${accountRoute}/activate`)
			.send({
				email: helper.newUser.email,
				activationToken: activationUUID
			})
			.expect(200)

		expect(result.body.message).toContain('Обліковий запис активовано')
	})

	test('user can\'t login if activated account is not approved by admin', async () => {
		const result = await api
			.post(loginRoute)
			.send({
				email: helper.newUser.email,
				password: helper.newUser.password
			})
			.expect(401)

		expect(result.body.message).toContain('Зачекайте, коли адміністратор сайту перегляне та затвердить ваш обліковий запис')
	})

	test('user can login with account approved by admin', async () => {
		// approve user account
		await User.findOneAndUpdate(
			{ email: helper.newUser.email },
			{ approvedUser: true })

		const result = await api
			.post(loginRoute)
			.send({
				email: helper.newUser.email,
				password: helper.newUser.password
			})
			.expect(200)

		// set auth token
		token = result.body.token
		expect(result.body.name).toContain(helper.newUser.name)
	})

	test('user account data is returned correctly', async () => {
		const [ user ] = await helper.usersInDb()

		const result = await api
			.post(`${loginRoute}/refresh/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(result.body.name).toContain(user.name)
	})
})

afterAll(async () => {
	await User.deleteMany({})
	await mongoose.connection.close()
})
