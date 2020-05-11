const classesRouter = require('express').Router()
const SchoolClass = require('../models/schoolClass')
const Teacher = require('../models/teacher')
const Pupil = require('../models/pupil')
const Specialty = require('../models/specialty')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// add new school class
classesRouter.post('/', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).send({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const { title, info, teacher, specialty, pupils } = { ...request.body }

		if (!title || !info || !teacher || !specialty || !pupils )
			return response.status(400).send({
				error: 'Деякі поля даних відсутні.'
			})

		// check if class name is already taken
		const existingClass = await SchoolClass.findOne({ title })
		if (existingClass) return response.status(400).json({
			message: 'Клас з такою назвою вже існує.',
			cause: 'title'
		})

		// preliminary data to save
		const schoolClassData = {
			title,
			info,
			teacher: null,
			specialty: null,
			pupils: []
		}

		// create new school class
		const schoolClass = new SchoolClass(schoolClassData)

		// get teacher data
		const teacherData = await Teacher.findOne({ name: teacher })
		if (!teacherData) {
			return response.status(404).send({
				error: 'Вчителя з таким ім\'ям не існує.'
			}) // else assign teacher
		} else schoolClass.teacher = teacherData._id

		// get specialty data
		const specialtyData = await Specialty.findOne({ title: specialty })
		if (!specialtyData) {
			return response.status(404).send({
				error: 'Спеціальності з цією назвою не існує.'
			})
		} else {
			// add school class to the specialty
			specialtyData.schoolClasses = specialtyData.schoolClasses.concat(schoolClass._id)
			await specialtyData.save()
			// add specialty to the class
			schoolClass.specialty = specialtyData._id
		}

		// get pupils ids
		let pupilsIds = []
		for (let person of pupils) {
			const pupil = await Pupil.findOne({ name: person })
			if (pupil) {
				pupil.schoolClasses = pupil.schoolClasses.concat(schoolClass._id)
				await pupil.save()
				// add id to the list
				pupilsIds.push(pupil._id)
			} else return response.status(404).send({
				error: 'Перевірте правильність імен учнів.',
				cause: 'pupils'
			})
		}
		// add pupils ids
		schoolClass.pupils = schoolClass.pupils.concat(pupilsIds)

		// save school class
		await schoolClass.save()

		// populate options
		const options = [
			{ path: 'teacher', select: 'name' },
			{ path: 'specialty', select: 'title' },
			{ path: 'pupils', select: 'name' }
		]

		// populate newly created class and send as a response
		const result = await SchoolClass.populate(schoolClass, options)
		return response.status(200).send(result.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// get all classes
classesRouter.get('/', async (request, response) => {
	const schoolClasses = await SchoolClass
		.find({})
		.populate('teacher', { name: 1 })
		.populate('specialty', { title: 1 })
		.populate('pupils', { name: 1 })
	return response.send(schoolClasses.map(schoolClass => schoolClass.toJSON()))
})


// delete school class
classesRouter.delete('/:id', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).send({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const schoolClass = await SchoolClass.findById(request.params.id)

		if (!schoolClass) {
			return response.status(404).send({
				error: 'Класу з цім ID не знайдено.'
			})
		} else {
			// remove refs from all pupils
			for (let id of schoolClass.pupils) {
				await Pupil.findByIdAndUpdate({ _id: id },
					{ $pull: { schoolClasses: schoolClass._id } })
			}
			// remove ref from specialty
			await Specialty.findByIdAndUpdate({ _id: schoolClass.specialty },
				{ $pull: { schoolClasses: schoolClass._id } })
		}

		await SchoolClass.findByIdAndRemove(schoolClass.id)
		return response.status(204).end()

	} catch (exception) {
		next(exception)
	}
})

// update school class data
classesRouter.put('/:id', async (request, response, next) => {
	try {
		const { title, info, teacher, specialty, pupils } = { ...request.body }

		if (!title || !info || !teacher || !specialty || !pupils )
			return response.status(400).send({
				error: 'Деякі поля даних відсутні.'
			})

		// get current unupdated class data
		const unupdatedClass = await SchoolClass.findById(request.params.id)
		let dataToSave = {
			title,
			info,
			teacher: null,
			specialty: null,
			pupils: null
		}

		// get id of the teacher and check if it exists
		const teacherData = await Teacher.findOne({ name: teacher }, '_id')
		if (!teacherData) {
			return response.status(404).send({
				error: 'Вчителя з таким ім\'ям не існує.'
			}) // check if teacher has changed
		} else if (JSON.stringify(unupdatedClass.teacher) !== JSON.stringify(teacherData._id)) {
			dataToSave.teacher = teacherData._id
		} else {
			dataToSave.teacher = unupdatedClass.teacher
		}

		// get id of the specialty and check if it exists
		const specialtyData = await Specialty.findOne({ title: specialty }, '_id')
		if (!specialtyData) {
			return response.status(404).send({
				error: 'Спеціальності з цією назвою не існує.'
			})	// check if specialty has changed
		} else if (JSON.stringify(unupdatedClass.specialty) !== JSON.stringify(specialtyData._id)) {
			dataToSave.specialty = specialtyData._id
		} else {
			dataToSave.specialty = unupdatedClass.specialty
		}

		// list ids of pupils from the request by their name
		let pupilsIds = []
		for (let person of pupils) {
			const pupil = await Pupil.findOne({ name: person })
			if (pupil) {
				pupilsIds.push(pupil._id.toString())
			} else return response.status(404).send({
				error: 'Перевірте правильність імен учнів.'
			})
			dataToSave.pupils = pupilsIds
		}

		// filter two arrays of ids (remove this from here)
		const filterIds = (idsToRemove, idsToAdd) => {
			idsToAdd = idsToAdd.filter(item => !idsToRemove.includes(item)
				? true
				: idsToRemove.splice(idsToRemove.indexOf(item), 1) && false)
			return { idsToRemove, idsToAdd }
		}
		const idsData = {
			removeData: unupdatedClass.pupils.map(id => id.toString()),
			addData: pupilsIds
		}
		const resultingIds = filterIds(idsData.removeData, idsData.addData)

		// remove class from these pupils
		for (let id of resultingIds.idsToRemove) {
			const pupil = await Pupil.findById(id)
			pupil.schoolClasses = pupil.schoolClasses
				.filter(schoolClass => schoolClass !== request.params.id)
			pupil.save()
		}

		// add class to these pupils
		for (let id of resultingIds.idsToAdd) {
			const pupil = await Pupil.findById(id)
			if (pupil.schoolClasses.indexOf(request.params.id) === -1) {
				pupil.schoolClasses = pupil.schoolClasses.concat(request.params.id)
				await pupil.save()
			}
		}

		const updatedSchoolClass = await SchoolClass
			.findByIdAndUpdate(request.params.id, { ...dataToSave }, { new: true })
			.populate('teacher', { name: 1 })
			.populate('specialty', { title: 1 })
			.populate('pupils', { name: 1 })
		return response.status(200).json(updatedSchoolClass.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = classesRouter
