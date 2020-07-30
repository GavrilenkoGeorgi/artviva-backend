const schoolRouter = require('express').Router()
const Teacher = require('../models/teacher')
const Pupil = require('../models/pupil')
const Specialty = require('../models/specialty')
const SchoolClass = require('../models/schoolClass')

// get all school info
schoolRouter.get('/', async (request, response) => {
	const teachers = await Teacher.find({})
	const pupils = await Pupil.find({})
	const specialties = await Specialty.find({})
	const schoolClasses =
		await SchoolClass.find({})
			.populate('teacher', { name: 1, teacherTitle: 1 })

	const data = {
		teachers,
		pupils,
		specialties,
		schoolClasses
	}
	return response.send(data)
})

module.exports = schoolRouter
