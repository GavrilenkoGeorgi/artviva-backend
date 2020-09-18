const specialtiesRouter = require('express').Router()
const Specialty = require('../models/specialty')
const { checkAuth } = require('../utils/checkAuth')

// create new specialty
specialtiesRouter.post('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {

			const { title, cost } = { ...request.body }
			if (!title || !cost ) {
				return response.status(400).send({
					message: 'Деякі обов\'язкові поля даних відсутні.'
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

			response.status(200).send(specialty.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// get all specialties
specialtiesRouter.get('/', async (request, response, next) => {
	try {
		const specialties = await Specialty
			.find({})

		response.status(200)
			.send(specialties.map(specialty => specialty.toJSON()))
	} catch (exception) {
		next(exception)
	}
})

// get current specialty prices
specialtiesRouter.get('/prices', async (request, response, next) => {
	try {
		const prices =
			await Specialty.find({ cost: { $gt: 1 } }, { title: 1, cost: 1 })
		response.status(200).json(prices)
	} catch (exception) {
		next(exception)
	}
})

// delete specialty
specialtiesRouter.delete('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const specialty = await Specialty.findById(request.params.id)

			if (!specialty) {
				return response.status(404)
					.send({ message: 'Спеціальність з цім ID не знайдена.' })
			} else if (specialty.schoolClasses.length > 0 || specialty.teachers.length > 0)
				return response.status(409)
					.send({ message: 'Ви повинні видалити всі класи або викладачів, які використовують цю спеціальність.' })
			await Specialty.findByIdAndRemove(specialty.id)

			response.status(204).end()
		}
	} catch (exception) {
		next(exception)
	}
})

// update specialty details
specialtiesRouter.put('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const updatedSpecialty = await Specialty
				.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })

			if (!updatedSpecialty) return response.status(404)
				.send({ message: 'Спеціальність з цім ID не знайдена.' })

			response.status(200).json(updatedSpecialty.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// get specialty details
specialtiesRouter.get('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const specialty = await Specialty
				.findById(request.params.id)

			if (!specialty) return response.status(404)
				.send({ message: 'Спеціальність з цім ID не знайдена.' })

			response.status(200).json(specialty.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = specialtiesRouter
