const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helpers/user_helper')
const app = require('../app')
const api = supertest(app)

const route = '/api/password'

beforeAll(async (done) => {
	await User.deleteMany({})
	supertest(app)
		.post('/api/users')
		.send({
			...helper.newUser,
			teacher: null
		})
		.end(() => {
			done()
		})
})

describe('Password recovery with expired token', () => {
	test('fails with status code 400', async () => {
		const [ user ] = await helper.usersInDb()

		// set user password recovery state
		let passResetToken
		const recoverData = await api
			.post(`${route}/recover`)
			.send({ email: user.email })
			.expect(200)

		passResetToken = recoverData.body.passResetToken

		const now = new Date()
		const expiryDate = new Date()
		expiryDate.setUTCHours(now.getUTCHours() - 2)

		// set expiry date 2 hours before current time
		await User.findOneAndUpdate(
			{ email: user.email },
			{ passResetHashExpiresAt: expiryDate })

		const result = await api
			.post(`${route}/reset`)
			.send({
				email: user.email,
				passResetToken: passResetToken,
				password: 'ValidPassword1'
			})
			.expect(400)

		expect(result.body.message)
			.toContain('Термін дії скидання пароля минув, спробуйте ще раз')
	})
})

afterAll(() => {
	mongoose.connection.close()
})
