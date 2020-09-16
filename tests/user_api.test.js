const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

// auth token var
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


describe('When there is initially one user at db', () => {
	beforeEach(async () => {
		await User.deleteMany({})
		const user = new User({
			email: 'test@example.com',
			name: 'Joe',
			middlename: 'Tester',
			lastname: 'Doe',
			password: 'TestPassword1'
		})
		await user.save()
	})

	test('It should require authorization', async () => {
		await api
			.get('/api/users')
			.then(response => {
				expect(response.statusCode).toBe(401)
			})
	})

	test('It responds with JSON', async () => {
		await api
			.get('/api/users')
			.set('Authorization', `Bearer ${token}`)
			.then((response) => {
				expect(response.statusCode).toBe(200)
				expect(response.type).toBe('application/json')
			})
	})

	test('Creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			email: 'test2@example.com',
			name: 'Jack',
			middlename: 'Second',
			lastname: 'Doe',
			password: 'TestPassword2'
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('Creation fails with proper status code and message if the username is already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			email: 'test@example.com',
			name: 'Joe',
			middlename: 'Tester',
			lastname: 'Doe',
			password: 'Propane_1'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(409)
			.expect('Content-Type', /application\/json/)

		expect(result.body.message).toContain('Адреса електронної пошти вже зайнята, вкажіть іншу.')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})

	test('Deletion succeeds with a proper status code', async () => {
		const usersAtStart = await helper.usersInDb()

		await api
			.delete(`/api/users/${usersAtStart[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
