const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helpers/specialties_helper')
const app = require('../app')
const api = supertest(app)
const Specialty = require('../models/specialty')

// auth token var
let token

const updatedSpecialty = {
	title: 'Updated title',
	cost: 999,
	info: 'Updated info'
}

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
	await Specialty.deleteMany({})

	const specialtiesObjects = helper.initialSpecialties
		.map(spec => new Specialty(spec))

	const promiseArray = specialtiesObjects.map(spec => spec.save())
	await Promise.all(promiseArray)
})

describe('When there are initially some specialties present', () => {
	test('specialties are returned as json', async () => {
		await api
			.get('/api/specialties')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all specialties are returned', async () => {
		const response = await api.get('/api/specialties')
		expect(response.body.length).toBe(helper.initialSpecialties.length)
	})

	test('a specific specialty is within the returned specialties', async () => {
		const response = await api.get('/api/specialties')
		const titles = response.body.map(spec => spec.title)

		expect(titles).toContain('Basic programming language')
	})
})

describe('Viewing a specified specialty', () => {
	test('succeeds with a valid id', async () => {

		const specialtiesAtStart = await helper.specialtiesInDb()
		const specialtyToView = specialtiesAtStart[0]

		const resultSpec = await api
			.get(`/api/specialties/${specialtyToView.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(resultSpec.body).toEqual(specialtyToView)
	})

	test('fails with status code 404 if specialty doesn\'t exist', async () => {
		const validNonExistingId = await helper.nonExistingSpecId()
		await api
			.get(`/api/specialties/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('fails with status code 400 if id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.get(`/api/specialties/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})
})

describe('Adding of a new specialty', () => {
	test('succeeds with valid data', async () => {
		const newSpecialty = {
			title: 'TypeScript',
			cost: 200,
			info: 'Additional non required info'
		}

		await api
			.post('/api/specialties')
			.set('Authorization', `Bearer ${token}`)
			.send(newSpecialty)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const specialtiesAtEnd = await helper.specialtiesInDb()
		expect(specialtiesAtEnd.length).toBe(helper.initialSpecialties.length + 1)

		const titles = specialtiesAtEnd.map(spec => spec.title)
		expect(titles).toContain('TypeScript')
	})

	test('fails with status code 400 if data is invalid', async () => {
		const newSpecialty = {
			title: '',
			cost: 100,
			info: ''
		}

		await api
			.post('/api/specialties')
			.set('Authorization', `Bearer ${token}`)
			.send(newSpecialty)
			.expect(400)

		const specialtiesAtEnd = await helper.specialtiesInDb()

		expect(specialtiesAtEnd.length).toBe(helper.initialSpecialties.length)
	})
})

describe('Deletion of a specialty', () => {
	test('succeeds with a status code of 204 if id is valid', async () => {
		const specialtiesAtStart = await helper.specialtiesInDb()
		const specialtyToDelete = specialtiesAtStart[0]

		await api
			.delete(`/api/specialties/${specialtyToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		const specialtiesAtEnd = await helper.specialtiesInDb()
		expect(specialtiesAtEnd.length).toBe(helper.initialSpecialties.length - 1)

		const titles = specialtiesAtEnd.map(response => response.title)
		expect(titles).not.toContain(specialtyToDelete.title)
	})
})

describe('Updating specialty', () => {
	test('succeeds with a status code of 200', async () => {
		const specialtiesAtStart = await helper.specialtiesInDb()
		const specialtyToUpdate = specialtiesAtStart[0]

		await api
			.put(`/api/specialties/${specialtyToUpdate.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updatedSpecialty)
			.expect(200)

		const specialtiesAtEnd = await helper.specialtiesInDb()
		const updatedSpec = specialtiesAtEnd.find(spec => spec.id === specialtyToUpdate.id)
		expect(updatedSpec.title).toBe('Updated title')
		expect(updatedSpec.cost).toBe(999)
		expect(updatedSpec.info).toBe('Updated info')
	})

	test('fails with status code of 404 if non existent id is supplied', async () => {
		const validNonExistingId = await helper.nonExistingSpecId()

		await api
			.put(`/api/specialties/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updatedSpecialty)
			.expect(404)
	})

	test('fails with status code 400 if id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.put(`/api/specialties/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updatedSpecialty)
			.expect(400)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
