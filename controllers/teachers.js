const teachersRouter = require('express').Router()
const Teacher = require('../models/teacher')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// create new teacher
teachersRouter.post('/', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}
		const { name } = { ...request.body }

		if (!name) {
			return response.status(400).send({
				error: 'Деякі обов\'язкові поля даних відсутні.'
			})
		}

		// check if specialty with this title already exists
		const existingTeacher = await Teacher.findOne({ name })
		if (existingTeacher) return response.status(400).json({
			message: 'Вчитель з таким ім’ям вже існує.',
			cause: 'name'
		})

		const teacher = new Teacher(request.body)
		await teacher.save()

		const newlyCreatedTeacher = await Teacher.findOne({ name }).populate('specialties', { title: 1 })
		return response.status(200).send(newlyCreatedTeacher.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// get all teachers
teachersRouter.get('/', async (request, response) => {
	const teachers = await Teacher
		.find({})
		.populate('specialties', { title: 1 })
		// .populate('payments', { description: 1, create_date: 1 })
		.populate({ path: 'payments', select: 'description create_date', populate: { path: 'paymentDescr' } })
	return response.send(teachers.map(teacher => teacher.toJSON()))
})

// delete single teacher
teachersRouter.delete('/:id', async (request, response, next) => {
	const token = getTokenFromReq(request)
	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'Неаутентифіковані. Маркер відсутній або недійсний.' })
		}

		const teacher = await Teacher.findById(request.params.id)

		if (!teacher) {
			return response.status(404).send({ error: 'Викладача із цим ідентифікатором не знайдено.' })
		}

		await Teacher.findByIdAndRemove(teacher._id)
		response.status(204).end()

	} catch (exception) {
		next(exception)
	}
})

// update teacher details
teachersRouter.put('/:id', async (request, response, next) => {
	try {
		await Teacher.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
		const newlyUpdatedTeacher =
			await Teacher.findById(request.params.id)
				.populate('specialties', { title: 1 })
				.populate('payments', { description: 1, create_date: 1 })

		return response.status(200).json(newlyUpdatedTeacher.toJSON())
	} catch (exception) {
		next(exception)
	}
})

// add teacher specialty
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

// delete teacher specialty
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
		const teacher = await Teacher.findOne({ _id: request.params.id })
			.populate('specialties', { title: 1 } )
			.populate({ path: 'payments', select: 'description create_date', populate: { path: 'paymentDescr' } })
			// .populate('payments', { description: 1, create_date: 1 })
		if (!teacher) return response.status(404).json({
			error: 'Викладача із цим ID не знайдено.'
		})

		response.status(200).json(teacher.toJSON())

	} catch(exception) {
		next(exception)
	}
})

module.exports = teachersRouter
