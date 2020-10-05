const mongoose = require('mongoose')
const supertest = require('supertest')
// const Payment = require('../models/payment')
const helper = require('./test_helpers/payment_helper')
const app = require('../app')
const api = supertest(app)

let token
const route = '/api/payment'

/*
beforeAll(async (done) => {
	await User.deleteMany({})
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
})*/

beforeAll((done) => {
	supertest(app)
		.post('/api/testing/login')
		.send({
			email: 'test@example.com',
			password: 'TestPassword1',
		})
		.end((err, response) => {
			token = response.body.token
			done()
		})
})

describe('Payment controller', () => {
	test('correctly forms payment data', async () => {

		const result = await api
			.post(`${route}/form`)
			.send(helper.singlePayment)
			.expect(200)

		expect(typeof result.body.data).toBe('string')
	})

	test('redirects to payments result page', async () => {
		const data = {}

		await api
			.get(`${route}/result`)
			.send(data)
			.expect(303)
	})

	test('fails to redirect if req body is not empty', async () => {
		const data = { status: 'test' }

		await api
			.get(`${route}/result`)
			.send(data)
			.expect(502)
	})

	test('fails to get a list of payments if unathorized', async () => {
		const date = new Date()

		await api
			.post(`${route}/reports`)
			.send({ date_from: date.valueOf(), date_to: date.valueOf() })
			.expect(401)
	})

	test('gets a list of payments for a given date range', async () => {
		const date_to = new Date()
		const date_from = new Date()

		date_from.setHours(date_from.getHours() - 1)

		await api
			.post(`${route}/reports`)
			.set('Authorization', `Bearer ${token}`)
			.send({ date_from: date_from.valueOf(), date_to: date_to.valueOf() })
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})