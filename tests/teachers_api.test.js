const mongoose = require('mongoose')
const supertest = require('supertest')
const Teacher = require('../models/teacher')
const User = require('../models/user')
const Specialty = require('../models/specialty')
const helper = require('./test_helpers/teacher_helper')
const userHelper = require('./test_helpers/user_helper')
const specialtyHelper = require('./test_helpers/specialties_helper')
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

beforeEach(async () => {
	await Teacher.deleteMany({})
	// await User.deleteMany({})

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
			.expect('Content-Type', /application\/json/)
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

describe('Viewing a specified teacher data', () => {
	test('fails without authorization token', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		await api
			.post(`/api/teachers/${firstTeacherEntry.id}`)
			.expect(401)
	})

	test('fails with status code 404 if the teacher doesn\'t exist', async () => {
		const validNonExistingId = await helper.nonExistingTeacherId()
		await api
			.get(`/api/teachers/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('succeeds with a valid ID', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		const result = await api
			.post(`/api/teachers/${firstTeacherEntry.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.id).toEqual(firstTeacherEntry.id)
	})
})

describe('Updating teacher data', () => {
	test('fails with status code of 404 if non existent ID is supplied', async () => {
		const validNonExistingId = await helper.nonExistingTeacherId()

		await api
			.put(`/api/teachers/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedTeacher)
			.expect(404)
	})

	test('fails with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.put(`/api/teachers/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedTeacher)
			.expect(400)
	})

	test('succeeds with a status code of 200', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		await api
			.put(`/api/teachers/${firstTeacherEntry.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedTeacher)
			.expect(200)

		const resultingTeachers = await helper.teachersInDb()
		const updatedTeacher = resultingTeachers.find(teacher => teacher.id === firstTeacherEntry.id)
		expect(updatedTeacher.name).toBe('Updated Teacher Data')
	})
})

describe('Deleting teacher data', () => {
	test('fails without authorization token', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		await api
			.delete(`/api/teachers/${firstTeacherEntry.id}`)
			.expect(401)
	})

	test('fails with status code 404 if non existent ID is supplied', async () => {
		const validNonExistingId = await helper.nonExistingTeacherId()

		await api
			.delete(`/api/teachers/${validNonExistingId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('fails with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.delete(`/api/teachers/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})

	test('fails with status code 409 if teacher has group/groups assigned', async () => {
		const teacher = new Teacher(helper.teacherWithAGroup)
		await teacher.save()

		await api
			.delete(`/api/teachers/${teacher._id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(409)
	})

	test('succeeds with a status code of 204', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		await api
			.delete(`/api/teachers/${firstTeacherEntry.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		const teachersAtEnd = await helper.teachersInDb()
		expect(teachersAtEnd.length).toBe(helper.sampleTeacherData.length - 1)

		const teachers = teachersAtEnd.map(teacher => teacher.name)
		expect(teachers).not.toContain(firstTeacherEntry.name)
	})
})

describe('Refs are correctly updated', () => {
	test('on delete, teacher ID from \'user\' model is removed', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		// clear users
		await User.deleteMany({})

		// create new one with linked teacher ID
		const userAccountWithTeacherRef = {
			email: 'with@teacher.com',
			name: 'Jack',
			middlename: 'With',
			lastname: 'Teacher',
			password: 'TestPassword2',
			teacher: firstTeacherEntry.id
		}

		const user = new User(userAccountWithTeacherRef)
		await user.save()

		// link current user account
		await Teacher.findByIdAndUpdate(firstTeacherEntry.id, { linkedUserAccountId: user._id })

		// delete teacher account
		await api
			.delete(`/api/teachers/${firstTeacherEntry.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		// check if ID was removed from user account
		const userList = await userHelper.usersInDb()
		const updatedUser = userList.find(person => person.id === user.id)
		expect(updatedUser.teacher).toBe(null)
	})

	test('on delete, teacher ID from \'specialty\' model is removed', async () => {
		const [ firstTeacherEntry ] = await helper.teachersInDb()

		// create specialties
		await Specialty.deleteMany({})
		const specialtiesObjects = specialtyHelper.initialSpecialties
			.map(spec => new Specialty(spec))
		const promiseArray = specialtiesObjects.map(spec => spec.save())
		await Promise.all(promiseArray)

		// add teacher ID to them and teacher
		const specs = await specialtyHelper.specialtiesInDb()
		for (const spec of specs) {
			await Specialty.findByIdAndUpdate(spec.id, { $push: { teachers: firstTeacherEntry.id } })
			await Teacher.findByIdAndUpdate(firstTeacherEntry.id, { $push: { specialties: spec.id } })
		}

		// delete teacher account
		await api
			.delete(`/api/teachers/${firstTeacherEntry.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		// check if everything was properly updated
		const resultingSpecs = await specialtyHelper.specialtiesInDb()
		for (const spec of resultingSpecs) {
			const specialty = await Specialty.findById(spec.id)
			expect(specialty.teachers).not.toContain(firstTeacherEntry.id)
		}
	})
})

afterAll(() => {
	mongoose.connection.close()
})
