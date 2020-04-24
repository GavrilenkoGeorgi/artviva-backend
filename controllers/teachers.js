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

		return response.status(200).send(teacher.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// get all teachers
teachersRouter.get('/', async (request, response) => {
	const teachers = await Teacher
		.find({})
		// .populate('user', { username: 1, name: 1 })
		// .populate('comments', { content: 1 })
	return response.send(teachers.map(teacher => teacher.toJSON()))
})

// delete single teacher
teachersRouter.delete('/:id', async (request, response, next) => {
	const token = getTokenFromReq(request)
	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' })
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
		const updatedTeacher = await Teacher
			.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
		return response.status(200).json(updatedTeacher.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = teachersRouter
