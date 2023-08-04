const mongoose = require('mongoose')
const supertest = require('supertest')
const SchoolClass = require('../models/schoolClass')
const helper = require('./test_helpers/schoolClass_helper')
const Teacher = require('../models/teacher')
const teacherHelper = require('./test_helpers/teacher_helper')
const Pupil = require('../models/pupil')
const pupilHelper = require('./test_helpers/pupil_helper')
const Specialty = require('../models/specialty')
const specialtyHelper = require('./test_helpers/specialties_helper')
const app = require('../app')
const api = supertest(app)

// auth token var
let token
// route to test
const route = '/api/schoolclasses'

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
	await SchoolClass.deleteMany({})
	await Teacher.deleteMany({})
	await Specialty.deleteMany({})
	await Pupil.deleteMany({})

	// set teacher
	const teacher = new Teacher(teacherHelper.teacherWithAGroup)
	await teacher.save()

	// set specialty
	const [ firstSpecialty ] = specialtyHelper.initialSpecialties
	const specialty = new Specialty(firstSpecialty)
	await specialty.save()

	// set pupils
	const pupils = pupilHelper.samplePupilData
		.map(pupil => new Pupil({ ...pupil, specialty: specialty.id }))
	const pupilsData = pupils.map(pupil => pupil.save())
	await Promise.all(pupilsData)

	// create class with all the data
	const [ firstPupil, secondPupil ] = pupils
	const schoolClasses = helper.sampleSchoolClasses
		.map(item => new SchoolClass({
			...item,
			teacher: teacher.id,
			specialty: specialty.id,
			pupils: [firstPupil.id, secondPupil.id]
		}))

	const classesData = schoolClasses.map(item => item.save())
	await Promise.all(classesData)
})

describe('When there are initially some school classes present', () => {
	test('list can be viewed by authorized users only', async () => {
		await api
			.get(route)
			.expect(401)
	})

	test('classes list is returned as json', async () => {
		await api
			.get('/api/schoolclasses')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('specific school class is with the returned list', async () => {
		const response = await api
			.get('/api/schoolclasses')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		const titles = response.body.map(item => item.title)
		expect(titles).toContain('Second Test Class')
	})

	test('all classes are returned', async () => {
		const response = await api
			.get('/api/schoolclasses')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body.length).toBe(helper.sampleSchoolClasses.length)
	})
})

describe('Viewing class data by given id', () => {
	test('fails without authorization token', async () => {
		const [ firstClassEntry ] = await helper.classesInDb()

		await api
			.post(`${route}/${firstClassEntry.id}`)
			.expect(401)
	})

	test('fails with status code 404 if the class doesn\'t exist', async () => {

		// getting invalid ID is rather complicated with school classes
		// here goes
		const [ teacher ] = await teacherHelper.teachersInDb()
		const [ pupil ] = await pupilHelper.pupilsInDb()
		const [ specialty ] = await specialtyHelper.specialtiesInDb()

		const schoolClassToRemove = new SchoolClass({
			title: 'Class to Remove',
			teacher: teacher.id,
			specialty: specialty.id,
			pupils: [ pupil.id ]
		})

		// save and remove to get ID
		await schoolClassToRemove.save()
		await schoolClassToRemove.remove()

		await api
			.post(`${route}/${schoolClassToRemove.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('fails with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.post(`${route}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})

	test('succeeds with status code 200 given a valid ID', async () => {
		const [ schoolClass ] = await helper.classesInDb()

		const result = await api
			.post(`${route}/${schoolClass.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.id).toEqual(schoolClass.id)
	})
})

describe('Updating school class', () => {
	test('fails with status code 401 without authorization token', async () => {
		const [ classToUpdate ] = await helper.classesInDb()

		await api
			.put(`${route}/${classToUpdate.id}`)
			.send(helper.updatedClass)
			.expect(401)
	})

	// invalid
	test('fails with status code 400 if invalid ID is given', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.put(`${route}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedClass)
			.expect(400)
	})

	// non-existent!
	test('fails with status code 404 if non-existent ID is given', async () => {
		const [ teacher ] = await teacherHelper.teachersInDb()
		const [ pupil ] = await pupilHelper.pupilsInDb()
		const [ specialty ] = await specialtyHelper.specialtiesInDb()

		const classData = {
			title: 'Class to Remove',
			info: 'Test class',
			teacher: teacher.id,
			specialty: specialty.id,
			pupils: [ pupil.id ]
		}

		const tempClass = new SchoolClass({
			...classData
		})

		await api
			.put(`${route}/${tempClass._id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(classData)
			.expect(404)
	})

	test('succeeds with status code 200', async () => {
		const [ classToUpdate ] = await helper.classesInDb()

		const result = await api
			.put(`${route}/${classToUpdate.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(helper.updatedClass)
			.expect(200)

		expect(result.body.title).toBe('Updated Test Class')
		expect(result.body.info).toBe('Updated info')
	})
})

describe('Deleting school class', () => {
	test('fails with status code 401 without authorization token', async () => {
		const [ schoolClass ] = await helper.classesInDb()

		await api
			.delete(`/api/pupils/${schoolClass.id}`)
			.expect(401)
	})

	test('fails with status code 400 if ID is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.delete(`${route}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
	})

	test('fails with status code 404 if valid non existent ID is supplied', async () => {
		const [ teacher ] = await teacherHelper.teachersInDb()
		const [ pupil ] = await pupilHelper.pupilsInDb()
		const [ specialty ] = await specialtyHelper.specialtiesInDb()

		const schoolClassToRemove = new SchoolClass({
			title: 'Class to Remove',
			teacher: teacher.id,
			specialty: specialty.id,
			pupils: [ pupil.id ]
		})

		// save and remove to get ID
		await schoolClassToRemove.save()
		await schoolClassToRemove.remove()

		await api
			.delete(`${route}/${schoolClassToRemove.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	test('succeeds with a status code of 204', async () => {
		const [ schoolClass ] = await helper.classesInDb()

		await api
			.delete(`${route}/${schoolClass.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		const resultingClassesList = await helper.classesInDb()
		expect(resultingClassesList.length).toBe(helper.sampleSchoolClasses.length - 1)

		const schoolClassTitles = resultingClassesList.map(item => item.title)
		expect(schoolClassTitles).not.toContain(schoolClass.title)
	})

})

afterAll(() => {
	mongoose.connection.close()
})
