// eslint-disable-next-line
const mongoose = require('mongoose')
const supertest = require('supertest')
const Teacher = require('../models/teacher')
const helper = require('./test_helpers/teacher_helper')
const app = require('../app')
const api = supertest(app)

// auth token var
// eslint-disable-next-line
let token

beforeAll((done) => {
	supertest(app)
		.post('/api/login')
		.send({
			email: 'test@example.com',
			password: 'TestPassword1',
		})
		.end((err, response) => {
			token = response.body.token
			done()
		})
})

beforeEach(async () => {
	await Teacher.deleteMany({})

	const teachers = helper.sampleTeacherData
		.map(teacher => new Teacher(teacher))

	const promiseArray = teachers.map(teacher => teacher.save())
	await Promise.all(promiseArray)
})

describe('When there are initially some teachers present', () => {
	test('teachers list is returned as json', async () => {
		await api
			.get('/api/teachers')
			.expect(200)
			//.expect('Content-Type', /application\/json/)
	})

	test('all teachers are returned', async () => {
		const response =
			await api.get('/api/teachers')
				.expect(200)
		expect(response.body.length).toBe(helper.sampleTeacherData.length)
	})

	test('a specific teacher is within the returned teachers', async () => {
		const response =
			await api.get('/api/teachers')
				.expect(200)

		const names = response.body.map(teacher => teacher.name)
		expect(names).toContain('John Tester Doe')
	})
})

afterAll(() => {
	mongoose.connection.close()
})
