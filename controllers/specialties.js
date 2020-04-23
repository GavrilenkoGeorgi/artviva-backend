const specialtiesRouter = require('express').Router()
const Specialty = require('../models/specialty')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// create new specialty
specialtiesRouter.post('/', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const { title, cost } = { ...request.body }

		if (!title || !cost ) {
			return response.status(400).send({
				error: 'Деякі обов\'язкові поля даних відсутні.'
			})
		}

		// check if specialty with this title already exists
		const existingSpecialty = await Specialty.findOne({ title })
		if (existingSpecialty) return response.status(400).json({
			message: 'Спеціальність вже існує.',
			cause: 'title'
		})

		const specialty = new Specialty(request.body)
		await specialty.save()

		return response.status(200).send(specialty.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// get all specialties
specialtiesRouter.get('/', async (request, response) => {
	const specialties = await Specialty
		.find({})
		// .populate('teachers', { name: 1 })
	return response.send(specialties.map(specialty => specialty.toJSON()))
})


// delete specialty
specialtiesRouter.delete('/:id', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).send({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const specialty = await Specialty.findById(request.params.id)

		if (!specialty) {
			return response.status(404).send({ error: 'Specialty not found' })
		}

		await Specialty.findByIdAndRemove(specialty.id)
		return response.status(204).end()

	} catch (exception) {
		next(exception)
	}
})

// update specialty details
specialtiesRouter.put('/:id', async (request, response, next) => {
	try {
		const updatedSpecialty = await Specialty
			.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
		return response.status(200).json(updatedSpecialty.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = specialtiesRouter
