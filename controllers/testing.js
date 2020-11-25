const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Pupil = require('../models/pupil')
const Teacher = require('../models/teacher')
const Specialty = require('../models/specialty')
const SchoolClass = require('../models/schoolClass')
const { hashString } = require('../utils/hashString')
const { sampleTeacherData } = require('../tests/test_helpers/teacher_helper')
const { initialSpecialties } = require('../tests/test_helpers/specialties_helper')
const { samplePupilData } = require('../tests/test_helpers/pupil_helper')
const { sampleSchoolClasses } = require('../tests/test_helpers/schoolClass_helper')

router.post('/reset', async (request, response) => {
	await User.deleteMany({})
	await Pupil.deleteMany({})
	await Teacher.deleteMany({})
	await Specialty.deleteMany({})
	await SchoolClass.deleteMany({})

	const user = new User({
		email: 'test@example.com',
		name: 'Joe',
		middlename: 'Tester',
		lastname: 'Doe',
		isActive: true,
		superUser: true,
		approvedUser: true,
		passwordHash: await hashString('TestPassword1')
	})
	await user.save()
	response.status(204).end()
})

router.post('/create/teachers', async (request, response) => {
	await Teacher.deleteMany({})
	await Specialty.deleteMany({})

	// teacher specialties
	const [ testSpecialty ] = initialSpecialties
	const specialty = new Specialty(testSpecialty)
	await specialty.save()

	const teachers = sampleTeacherData
		.map(teacher => new Teacher({ ...teacher, specialties: [specialty.id ] }))

	const promiseArray = teachers.map(teacher => teacher.save())
	await Promise.all(promiseArray)

	response.status(204).end()
})

router.post('/create/pupils', async (request, response) => {
	await Pupil.deleteMany({})
	await Specialty.deleteMany({})

	// create specilaties
	const specialties = initialSpecialties
		.map(spec => new Specialty(spec))

	const specialtiesArray = specialties.map(spec => spec.save())
	await Promise.all(specialtiesArray)

	const [ firstSpec, secondSpec ] = specialties
	const [ firstPupil, secondPupil ] = samplePupilData

	const pupils = [
		new Pupil({ ...firstPupil, specialty: firstSpec.id }),
		new Pupil({ ...secondPupil, specialty: secondSpec.id })
	]

	const pupilsToSave = pupils.map(pupil => pupil.save())
	await Promise.all(pupilsToSave)

	response.status(204).end()
})

router.post('/create/specialties', async (request, response) => {
	await Specialty.deleteMany({})

	const specialtiesObjects = initialSpecialties
		.map(spec => new Specialty(spec))

	const promiseArray = specialtiesObjects.map(spec => spec.save())
	await Promise.all(promiseArray)

	response.status(204).end()
})

router.post('/create/defaultState', async (request, response) => {
	await Specialty.deleteMany({})
	await Teacher.deleteMany({})
	await Pupil.deleteMany({})
	await SchoolClass.deleteMany({})

	// create specilaties
	const specialties = initialSpecialties
		.map(spec => new Specialty(spec))

	const specialtiesArray = specialties.map(spec => spec.save())
	await Promise.all(specialtiesArray)

	const [ firstSpec, secondSpec ] = specialties
	const [ firstPupil, secondPupil ] = samplePupilData

	// create teachers
	const teachers = sampleTeacherData
		.map(teacher => new Teacher({ ...teacher, specialties: [ firstSpec.id ] }))

	// update specialy teacher refs
	teachers.map(async teacher => {
		await Specialty.findByIdAndUpdate(firstSpec.id,
			{ $push: { teachers: teacher.id } })
	})

	const [ teacher ] = teachers
	const teachersToSave = teachers.map(teacher => teacher.save())
	await Promise.all(teachersToSave)

	// create pupils
	const pupils = [
		new Pupil({ ...firstPupil, specialty: firstSpec.id }),
		new Pupil({ ...secondPupil, specialty: secondSpec.id })
	]
	const pupilsToSave = pupils.map(pupil => pupil.save())
	const [ pupilOne, pupilTwo ] = pupils
	await Promise.all(pupilsToSave)

	const [ firstClass, secondClass ] = sampleSchoolClasses
	const schoolClasses = [
		new SchoolClass({
			...firstClass,
			teacher: teacher.id,
			specialty: firstSpec.id,
			pupils: [ pupilOne.id ]
		}),
		new SchoolClass({
			...secondClass,
			teacher: teacher.id,
			specialty: secondSpec.id,
			pupils: [ pupilOne.id, pupilTwo.id ]
		})
	]

	// update specialty school classes refs
	schoolClasses.map(async schoolClass => {
		await Specialty.findByIdAndUpdate(firstSpec.id,
			{ $push: { schoolClasses: schoolClass.id } })
	})

	const classesToSave = schoolClasses.map(item => item.save())
	await Promise.all(classesToSave)

	response.status(204).end()
})

router.post('/login', async (request, response) => {
	const {
		email,
		password
	} = { ...request.body }

	const testUserToken = {
		email: email,
		id: password //use pwd as test id
	}

	const token = jwt.sign(testUserToken, process.env.SECRET)
	response.status(200).send({ token })
})

module.exports = router
