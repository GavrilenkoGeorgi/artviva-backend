const mongoose = require('mongoose')
const supertest = require('supertest')
const Payment = require('../models/payment')
const helper = require('./test_helpers/payment_helper')
const app = require('../app')
const PaymentDescr = require('../models/paymentDescr')
const { getPaymentDataFromString } = require('../utils/processPaymentDescr')
const api = supertest(app)

let token
const route = '/api/payment'

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

	test('fails to get a list of payments if unauthorized', async () => {
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

describe('Backup payment list in DB', () => {
	beforeEach(async () => {
		await Payment.deleteMany({})
		await PaymentDescr.deleteMany({})

		const paymentDescriptions = []
		helper.samplePayments.forEach(payment => {
			paymentDescriptions.push(getPaymentDataFromString(payment.description, 'uk-UA'))
		})

		const descriptions = paymentDescriptions.map(descr => new PaymentDescr(descr))
		const descrToSave = descriptions.map(descr => descr.save())
		await Promise.all(descrToSave)

		const descrInDb = await PaymentDescr.find({})

		const payments = helper.samplePayments
			.map((payment, index) => new Payment({ ...payment, paymentDescr: descrInDb[index].id }))

		const samplePayments = payments.map(payment => payment.save())
		await Promise.all(samplePayments)
	})

	test('fails with status code 401 to return list of descriptions without authorization', async () => {
		await api
			.get(`${route}/descr`)
			.expect(401)
	})

	test('returns all payments descriptions', async () => {
		await api
			.get(`${route}/descr`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
			.then(response => {
				expect(response.body.length).toBe(helper.samplePayments.length)
			})
	})

	test('fails to return JSON with status code 401 without authorization', async () => {
		await api
			.get(`${route}/list`)
			.expect(401)
	})

	test('is returned as JSON', async () => {
		await api
			.get(`${route}/list`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('fails to get payment by ID with status code 401 without authorization', async () => {
		const [ payment ] = await helper.paymentsInDb()

		await api
			.get(`${route}/${payment.id}`)
			.expect(401)
	})

	test('fails to get payment by ID with status code 404 with nonexistent ID', async () => {
		const validId = await helper.validNonExistingId()

		await api
			.get(`${route}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
			.then(response => {
				expect(response.body.error).toContain('Платежу із цим ідентифікатором не знайдено')
			})
	})

	test('fails to get payment by ID with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.get(`${route}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})

	test('gets single payment by given ID', async () => {
		const [ payment ] = await helper.paymentsInDb()

		await api
			.get(`${route}/${payment.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
			.then(response => {
				expect(response.body.id).toBe(payment.id)
			})
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
