const mongoose = require('mongoose')
const supertest = require('supertest')
const Pupil = require('../models/pupil')
const Specialty = require('../models/specialty')
const helper = require('./test_helpers/pupil_helper')
const specialtyHelper = require('./test_helpers/specialties_helper')
const app = require('../app')
const api = supertest(app)

// auth token var
let token

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

beforeEach(async () => {
	await Pupil.deleteMany({})
	await Specialty.deleteMany({})

	const [ testSpecialty ] = specialtyHelper.initialSpecialties
	const specialty = new Specialty(testSpecialty)
	await specialty.save()

	const pupils = helper.samplePupilData
		.map(pupil => new Pupil({ ...pupil, specialty: specialty._id }))
	const promiseArray = pupils.map(pupil => pupil.save())

	await Promise.all(promiseArray)
})

describe('When there are initially some pupils present', () => {
	test('pupils list is returned as json', async () => {
		await api
			.get('/api/pupils')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('can be viewed by authorized users only', async () => {
		await api
			.get('/api/pupils')
			.expect(401)
	})

	test('all pupils are returned', async () => {
		const response =
			await api
				.get('/api/pupils')
				.set('Authorization', `Bearer ${token}`)
				.expect(200)
		expect(response.body.length).toBe(helper.samplePupilData.length)
	})

	test('a specific pupil is within the returned pupils', async () => {
		const response =
			await api
				.get('/api/pupils')
				.set('Authorization', `Bearer ${token}`)
				.expect(200)

		const names = response.body.map(pupil => pupil.name)
		expect(names).toContain('Second Test Pupil')
	})
})

describe('Viewing a specified pupil data', () => {
	test('fails without authorization token', async () => {
		const [ firstPupilEntry ] = await helper.pupilsInDb()

		await api
			.get(`/api/pupils/${firstPupilEntry.id}`)
			.expect(401)
	})

	test('fails with status code 404 if pupil doesn\'t exist', async () => {
		const validNonExistingId = await helper.nonExistingPupilId()
		await api
			.get(`/api/pupils/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('succeeds with a valid ID', async () => {
		const [ testPupil ] = await helper.pupilsInDb()

		const result = await api
			.get(`/api/pupils/${testPupil.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.id).toEqual(testPupil.id)
	})
})

describe('Updating pupil data', () => {
	test('fails with status code of 404 if non existent ID is supplied', async () => {
		const validNonExistingId = await helper.nonExistingPupilId()

		await api
			.put(`/api/pupils/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedPupil)
			.expect(404)
	})

	test('fails with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.put(`/api/pupils/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedPupil)
			.expect(400)
	})

	test('succeeds with a status code of 200', async () => {
		const [ pupilToUpdate ] = await helper.pupilsInDb()

		await api
			.put(`/api/pupils/${pupilToUpdate.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedPupil)
			.expect(200)

		const resultingPupils = await helper.pupilsInDb()
		const updatedPupil = resultingPupils.find(pupil => pupil.id === pupilToUpdate.id)
		expect(updatedPupil.name).toBe('Updated Test Pupil')
	})
})

describe('Deleting pupil data', () => {
	test('fails without authorization token', async () => {
		const [ pupilToDelete ] = await helper.pupilsInDb()

		await api
			.delete(`/api/pupils/${pupilToDelete.id}`)
			.expect(401)
	})

	test('fails with status code 404 if non existent ID is supplied', async () => {
		const validNonExistingId = await helper.nonExistingPupilId()

		await api
			.delete(`/api/pupils/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('fails with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.delete(`/api/pupils/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})

	test('fails with status code 409 if pupil is assigned to a class', async () => {
		const pupil = new Pupil(helper.pupilWithAClass)
		await pupil.save()

		await api
			.delete(`/api/pupils/${pupil._id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(409)
	})

	test('succeeds with a status code of 204', async () => {
		const [ pupilToDelete ] = await helper.pupilsInDb()

		await api
			.delete(`/api/pupils/${pupilToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		const resultingPupilsList = await helper.pupilsInDb()
		expect(resultingPupilsList.length).toBe(helper.samplePupilData.length - 1)

		const pupils = resultingPupilsList.map(pupil => pupil.name)
		expect(pupils).not.toContain(pupilToDelete.name)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
