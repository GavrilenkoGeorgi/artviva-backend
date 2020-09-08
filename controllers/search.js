const searchRouter = require('express').Router()
const Teacher = require('../models/teacher')
const User = require('../models/user')
const Pupil = require('../models/pupil')
const Specialty = require('../models/specialty')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// search teachers by given value
searchRouter.post('/teachers', async (request, response, next) => {
	try {
		const { value } = { ...request.body }

		if (!value) {
			return response.status(400).send({
				error: 'Перевірте тіло запиту, поле \'значення\' відсутнє.'
			})
		}

		const teachers = await Teacher
			.find({ name: { $regex: request.body.value, $options: 'ig' } })
		response.send(teachers.map(teacher => teacher.name))

	} catch (exception) {
		next(exception)
	}
})

// search users by given value
searchRouter.post('/users', async (request, response, next) => {
	try {
		const { value } = { ...request.body }
		// can't find users by email when using
		// mailbox+1@example.com or mailbox+something@example.com
		// anyway it is the same inbox in the end
		// behold a Quick Fix
		let query = ''

		if (value) {
			const specCharIdx = value.indexOf('+')
			query = value.slice(0, specCharIdx)
		} else return response.status(400).send({
			error: 'Перевірте тіло запиту, поле \'значення\' відсутнє.'
		})

		const users = await User
			.find({ email: { $regex: query, $options: 'ig' } })
		response.send(users.map(({ email, name, lastname, _id }) =>
			({ email, name, lastname, id: _id })))// this looks strange

	} catch (exception) {
		next(exception)
	}
})

// search pupils by given value
searchRouter.post('/pupils', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}
		const { value } = { ...request.body }

		if (!value) {
			return response.status(400).send({
				error: 'Перевірте тіло запиту, поле \'значення\' відсутнє.'
			})
		}

		const pupils = await Pupil
			.find({ name: { $regex: request.body.value, $options: 'ig' } })
		response.send(pupils.map(pupil => pupil.name))

	} catch (exception) {
		next(exception)
	}
})

// search specialties by given value
searchRouter.post('/specialties', async (request, response, next) => {
	try {
		const { value } = { ...request.body }

		if (!value) {
			return response.status(400).send({
				error: 'Перевірте тіло запиту, поле \'значення\' відсутнє.'
			})
		}

		const specialties = await Specialty
			.find({ title: { $regex: request.body.value, $options: 'ig' } })
		response.send(specialties.map(specialty => specialty.title))

	} catch (exception) {
		next(exception)
	}
})

// get teacher name by id
searchRouter.get('/teachers/name/:id', async (request, response, next) => {
	try {
		const teacher = await Teacher.findById(request.params.id)
		if (!teacher)
			return response.status(404)
				.send({ message: 'Викладача із цим ідентифікатором не знайдено.' })
		response.send({ name: teacher.name })
	} catch (exception) {
		next(exception)
	}
})

// get user email by id (some auth check, huh?)
searchRouter.get('/users/email/:id', async (request, response, next) => {
	try {
		const user = await User.findById(request.params.id).select('email name middlename lastname')
		if (!user)
			return response.status(404)
				.send({ message: 'Викладача із цим ідентифікатором не знайдено.' })
		response.status(200).send(user)
	} catch (exception) {
		next(exception)
	}
})

module.exports = searchRouter
