const teachersRouter = require('express').Router()
const Teacher = require('../models/teacher')
const Specialty = require('../models/specialty')
const { filterIds } = require('../utils/arrayHelpers')
const { checkAuth } = require('../utils/checkAuth')

// create new teacher
teachersRouter.post('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const { name } = { ...request.body }

			// check if teacher with this name already exists
			const existingTeacher = await Teacher.findOne({ name })
			if (existingTeacher) return response.status(400).json({
				message: 'Вчитель з таким ім’ям вже існує.',
				cause: 'name'
			})

			const teacher = new Teacher(request.body)
			await teacher.save()

			// add teacher to specialty
			for (let id of teacher.specialties) {
				await Specialty.findByIdAndUpdate({ _id: id },
					{ $push: { teachers: teacher._id } })
			}

			const newlyCreatedTeacher =
				await Teacher.findOne({ name })
					.populate('specialties', { title: 1 })
			response.status(200).send(newlyCreatedTeacher.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// get all teachers
// without auth check for use in the public payment form
// really has to be a different route
teachersRouter.get('/', async (request, response) => {
	const teachers = await Teacher
		.find({})
		.populate('specialties', { title: 1 })
		.populate('schoolClasses', { title: 1 })
		.populate({ path: 'payments', select: 'description create_date', populate: { path: 'paymentDescr' } })
	response.send(teachers.map(teacher => teacher.toJSON()))
})

// delete single teacher
teachersRouter.delete('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const teacher = await Teacher.findById(request.params.id)

			if (!teacher) {
				return response.status(404)
					.send({ message: 'Викладача із цим ідентифікатором не знайдено.' })
			} else if (teacher.schoolClasses.length > 0) {
				return response.status(409)
					.send({ message: 'Неможливо видалити вчителя, у нього є активні класи, видаліть їх, а потім спробуйте ще раз.' })
			}

			for (let id of teacher.specialties) {
				await Specialty.findByIdAndUpdate({ _id: id },
					{ $pull: { teachers: teacher._id } })
			}

			await Teacher.findByIdAndRemove(teacher._id)
			response.status(204).end()
		}
	} catch (exception) {
		next(exception)
	}
})

// update teacher details
teachersRouter.put('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const teacherID = request.params.id
			// get unupdated teacher
			const unUpdatedTeacher = await Teacher.findById(teacherID)

			if (!unUpdatedTeacher)
				return response.status(404)
					.json({ message: 'Викладача із заданим ідентифікатором не знайдено.' })

			const unUpdatedSpecialtiesIds = unUpdatedTeacher.specialties
			const idsData = {
				oldIds: unUpdatedSpecialtiesIds,
				newIds: request.body.specialties
			}
			// filter ids to get ids from which to remove and add teacher
			const resultingIds = filterIds(idsData.oldIds, idsData.newIds)

			// remove teacher from these specialties
			for (let id of resultingIds.idsToRemove) {
				await Specialty.findByIdAndUpdate({ _id: id },
					{ $pull: { teachers: teacherID } })
			}

			// add teacher to these specialties
			for (let id of resultingIds.idsToAdd) {
				await Specialty.findByIdAndUpdate({ _id: id },
					{ $push: { teachers: teacherID } })
			}

			// finally update teacher
			await Teacher.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
			const updatedTeacher =
				await Teacher.findById(request.params.id)
					.populate('specialties', { title: 1 })
					.populate({ path: 'payments', select: 'description create_date', populate: { path: 'paymentDescr' } })

			response.status(200).json(updatedTeacher.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// add teacher specialty whats this??
teachersRouter.post('/:id/specialties', async (request, response, next) => {
	try {
		const { specialtyId } = { ...request.body }
		if (!specialtyId) return response.status(400).send({
			error: 'Деякі обов\'язкові поля даних відсутні.'
		})

		const teacher = await Teacher.findById(request.params.id)
		if (teacher.specialties.indexOf(specialtyId) >= 0) {
			return response.status(400).json({
				error: 'Цей викладач вже має цю спеціальність.'
			})
		}

		teacher.specialties = teacher.specialties.concat(specialtyId)
		await teacher.save()
		response.json(teacher.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// delete teacher specialty and this?
teachersRouter.patch('/:id/specialties', async (request, response, next) => {
	try {
		const { specialtyId } = { ...request.body }
		if (!specialtyId) return response.status(400).send({
			error: 'Деякі обов\'язкові поля даних відсутні.'
		})

		const teacher = await Teacher.findById(request.params.id)
		if (teacher.specialties.indexOf(specialtyId) === -1) {
			return response.status(400).json({
				error: 'Цей викладач не має цієї спеціальності.'
			})
		}

		const index = teacher.specialties.indexOf(specialtyId)
		teacher.specialties.splice(index, 1)
		await teacher.save()
		response.json(teacher.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// get single teacher info
teachersRouter.post('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const teacher = await Teacher.findOne({ _id: request.params.id })
				.populate('specialties', { title: 1 } )
				.populate({ path: 'payments', select: 'description create_date', populate: { path: 'paymentDescr' } })
			if (!teacher) return response.status(404).json({
				message: 'Викладача із цим ID не знайдено.'
			})

			response.status(200).json(teacher.toJSON())
		}
	} catch(exception) {
		next(exception)
	}
})

module.exports = teachersRouter
