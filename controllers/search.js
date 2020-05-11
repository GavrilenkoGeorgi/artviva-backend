const searchRouter = require('express').Router()
const Teacher = require('../models/teacher')
const Pupil = require('../models/pupil')
const Specialty = require('../models/specialty')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// search teachers by given value
searchRouter.post('/teachers', async (request, response, next) => {

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

		const teachers = await Teacher
			.find({ name: { $regex: request.body.value, $options: 'ig' } })
		response.send(teachers.map(teacher => teacher.name))

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

		const specialties = await Specialty
			.find({ title: { $regex: request.body.value, $options: 'ig' } })
		response.send(specialties.map(specialty => specialty.title))

	} catch (exception) {
		next(exception)
	}
})

module.exports = searchRouter
