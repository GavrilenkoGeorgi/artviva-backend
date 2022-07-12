const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helpers/user_helper')
const app = require('../app')
const api = supertest(app)

let passResetToken
const route = '/api/password'

beforeAll((done) => {
	// User.deleteMany({})
	supertest(app)
		.post('/api/users')
		.send({
			...helper.newUser,
			teacher: null
		})
		.end(() => {
			// activationUUID = response.body.testUUID
			done()
		})
})

describe('Password recovery', () => {
	test('fails with status code 400 malformed request', async () => {
		const [ user ] = await helper.usersInDb()

		const result = await api
			.post(`${route}/recover`)
			.send({ mail: user.email })
			.expect(400)

		expect(result.body.message).toContain('Поле даних електронної пошти відсутнє')
	})

	test('fails with status code 422 incorrect email', async () => {
		const result = await api
			.post(`${route}/recover`)
			.send({ email: 'incorrect.email.com' })
			.expect(422) //?

		expect(result.body.message).toContain('Email не є допустимим')
	})

	test('fails with status code 404 given valid non existent email', async () => {
		const result = await api
			.post(`${route}/recover`)
			.send({ email: 'valid@example.com' })
			.expect(404)

		expect(result.body.message).toContain('Користувач не знайдений')
	})

	test('succeeds with correct user email', async () => {
		const [ user ] = await helper.usersInDb()

		const result = await api
			.post(`${route}/recover`)
			.send({ email: user.email })
			.expect(200)

		passResetToken = result.body.passResetToken
	})
})

describe('Password reset', () => {
	test('fails with status code 400 is some request data if malformed', async () => {
		const result = await api
			.post(`${route}/reset`)
			.send({
				mail: 'user@email.com',
				passResetToken: passResetToken,
				password: 'ValidPassword1'
			})
			.expect(400)

		expect(result.body.message).toContain('Поля email, пароля або UUID відсутні')
	})

	test('fails with status code 404 if non existent user email is provided', async () => {
		const result = await api
			.post(`${route}/reset`)
			.send({
				email: 'user@email.com',
				passResetToken: passResetToken,
				password: 'ValidPassword1'
			})
			.expect(404)

		expect(result.body.message).toContain('Користувача з цією електронною адресою не існує')
	})

	test('fails with status code 422 if invalid user email is provided', async () => {
		const result = await api
			.post(`${route}/reset`)
			.send({
				email: 'email.com',
				passResetToken: passResetToken,
				password: 'ValidPassword1'
			})
			.expect(422)

		expect(result.body.message).toContain('Email, пароль або UUID не відповідають дійсній схемі')
	})

	test('fails with status code 422 if invalid reset token is provided', async () => {
		const [ user ] = await helper.usersInDb()

		const result = await api
			.post(`${route}/reset`)
			.send({
				email: user.email,
				passResetToken: passResetToken.slice(0, 10),
				password: 'ValidPassword1'
			})
			.expect(422)

		expect(result.body.message).toContain('Email, пароль або UUID не відповідають дійсній схемі')
	})


	test('succeeds with status code 200 if valid data is provided', async () => {
		const result = await api
			.post(`${route}/reset`)
			.send({
				email: 'test@example.com',
				passResetToken: passResetToken,
				password: 'ValidPassword1'
			})
			.expect(200)

		expect(result.body.message)
			.toContain('Пароль успішно скинуто')
	})

	test('fails with status code 400 if reset token is already have been used', async () => {
		const [ user ] = await helper.usersInDb()

		const result = await api
			.post(`${route}/reset`)
			.send({
				email: user.email,
				passResetToken: passResetToken,
				password: 'ValidPassword1'
			})
			.expect(400)

		expect(result.body.message).toContain('Ви вже використовували це посилання для скидання пароля, або UUID у посиланні не відповідає тому, який знаходиться в базі даних')
	})
})

afterAll(async () => {
	await User.deleteMany({})
	await mongoose.connection.close()
})
