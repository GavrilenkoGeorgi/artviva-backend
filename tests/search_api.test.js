const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Teacher = require('../models/teacher')
const teacherHelper = require('./test_helpers/teacher_helper')
const Pupil = require('../models/pupil')
const pupilHelper = require('./test_helpers/pupil_helper')
const User = require('../models/user')
const userHelper = require('./test_helpers/user_helper')
const Specialty = require('../models/specialty')
const specialtyHelper = require('./test_helpers/specialties_helper')

// auth token var
let token
// current route
const route = '/api/search'

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

describe('Teachers list full text search', () => {
	beforeEach(async () => {
		await Teacher.deleteMany({})

		const teachers = teacherHelper.sampleTeacherData
			.map(teacher => new Teacher(teacher))

		const promiseArray = teachers.map(teacher => teacher.save())
		await Promise.all(promiseArray)
	})

	test('fails with status code 400 if query is empty', async () => {
		const query = { value: '' }

		await api
			.post(`${route}/teachers`)
			.send(query)
			.expect(400)
	})

	test('returns list of all matching teachers names', async () => {
		// common name between two sample teachers
		const query = { value: 'Tester' }

		const result = await api
			.post(`${route}/teachers`)
			.send(query)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.length).toBe(teacherHelper.sampleTeacherData.length)
	})

	test('returns specific teacher name', async () => {
		const query = { value: 'Mary' }

		const result = await api
			.post(`${route}/teachers`)
			.send(query)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.length).toBe(1)
		expect(result.body).toContain('Mary Tester Doe')
	})

	test('fails with status code 404 if supplied with non existent ID', async () => {
		const validNonExistingId = await teacherHelper.nonExistingTeacherId()

		await api
			.post(`${route}/teachers/name/${validNonExistingId}`)
			.expect(404)
			.expect('Content-Type', /application\/json/)
	})

	test('returns teacher name by given ID', async () => {
		const [ teacher ] = await teacherHelper.teachersInDb()

		const result = await api
			.get(`${route}/teachers/name/${teacher.id}`)
			.expect(200)

		expect(result.body.name).toContain(teacher.name)
	})
})

describe('Pupils list full text search', () => {
	beforeEach(async () => {
		await Pupil.deleteMany({})
		await Specialty.deleteMany({})

		const [ testSpecialty ] = specialtyHelper.initialSpecialties
		const specialty = new Specialty(testSpecialty)
		await specialty.save()

		const pupils = pupilHelper.samplePupilData
			.map(pupil => new Pupil({ ...pupil, specialty: specialty._id }))
		const promiseArray = pupils.map(pupil => pupil.save())

		await Promise.all(promiseArray)
	})

	test('fails with status code 401 if unauthorized', async () => {
		const query = { value: 'Test Pupil' }

		await api
			.post(`${route}/pupils`)
			.send(query)
			.expect(401)
	})

	test('fails with status code 400 if query is empty', async () => {
		const query = { value: '' }

		await api
			.post(`${route}/pupils`)
			.send(query)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})

	test('returns list of all matching pupils names', async () => {
		const query = { value: 'Test Pupil' }

		const result = await api
			.post(`${route}/pupils`)
			.send(query)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.length).toBe(pupilHelper.samplePupilData.length)
	})

	test('returns specific pupil name', async () => {
		const query = { value: 'Second' }

		const result = await api
			.post(`${route}/pupils`)
			.send(query)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.length).toBe(1)
		expect(result.body).toContain('Second Test Pupil')
	})
})

describe('Specialties list full text search', () => {
	beforeEach(async () => {
		await Specialty.deleteMany({})

		const specialtiesObjects = specialtyHelper.initialSpecialties
			.map(spec => new Specialty(spec))

		const promiseArray = specialtiesObjects.map(spec => spec.save())
		await Promise.all(promiseArray)
	})

	test('fails with status code 400 if query is empty', async () => {
		const query = { value: '' }

		await api
			.post(`${route}/specialties`)
			.send(query)
			.expect(400)
	})

	test('returns all matching specialties titles', async () => {
		const query = { value: 'Java' }

		const result = await api
			.post(`${route}/specialties`)
			.send(query)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.length).toBe(2)
	})

	test('specific specialty is within returned list', async () => {
		const query = { value: 'prog' }
		const [ firstSpecialty ] = specialtyHelper.initialSpecialties

		const result = await api
			.post(`${route}/specialties`)
			.send(query)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body).toContain(firstSpecialty.title)
	})
})

describe('Users email full text search', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const users = userHelper.sampleUsers
			.map(user => new User(user))

		const promiseArray = users.map(user => user.save())
		await Promise.all(promiseArray)
	})

	test('fails with status code 400 if query is empty', async () => {
		const query = { value: '' }

		await api
			.post(`${route}/users`)
			.send(query)
			.expect(400)
	})

	test('returns all matching users', async () => {
		const query = { value: 'example' }

		const result = await api
			.post(`${route}/users`)
			.send(query)
			.expect(200)

		expect(result.body.length).toBe(2)
	})

	test('correctly returns specific user', async () => {
		const query = { value: 'mary' }

		const result = await api
			.post(`${route}/users`)
			.send(query)
			.expect(200)

		const [ userData ] = result.body
		expect(userData.email).toContain('mary@example.com')
	})

	test('fails with status code 404 if non existent ID is used', async () => {
		const id = await userHelper.validNonExistingId()

		await api
			.get(`${route}/users/email/${id}`)
			.expect(404)
	})

	test('returns user email by given ID', async () => {
		const [ user ] = await userHelper.usersInDb()

		const result = await api
			.get(`${route}/users/email/${user.id}`)
			.expect(200)

		expect(result.body.email).toContain(user.email)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
