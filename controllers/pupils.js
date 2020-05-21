const pupilsRouter = require('express').Router()
const Pupil = require('../models/pupil')
const { checkAuth } = require('../utils/checkAuth')

// create new pupil
pupilsRouter.post('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const { name } = { ...request.body }
			if (!name) {
				return response.status(400).send({
					error: 'Деякі обов\'язкові поля даних відсутні.'
				})
			}

			// check if specialty with this title already exists
			const existingPupil = await Pupil.findOne({ name })
			if (existingPupil) return response.status(400).json({
				message: 'Учень з таким ім’ям вже існує.',
				cause: 'name'
			})

			const pupil = new Pupil(request.body)
			await pupil.save()

			response.status(200).send(pupil.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// get all pupils
pupilsRouter.get('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const pupils = await Pupil
				.find({})
				.populate('schoolClasses', { title: 1 })
			response.send(pupils.map(pupil => pupil.toJSON()))
		}
	} catch (exception) {
		next(exception)
	}
})

// delete single pupil
pupilsRouter.delete('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const pupil = await Pupil.findById(request.params.id)
			if (!pupil) {
				return response.status(404).send({ error: 'Учня із цим ідентифікатором не знайдено.' })
			}

			await Pupil.findByIdAndRemove(pupil._id)
			response.status(204).end()
		}
	} catch (exception) {
		next(exception)
	}
})

// update pupil details
pupilsRouter.put('/:id', async (request, response, next) => {
	try {
		if(checkAuth(request)) {
			const updatedPupil = await Pupil
				.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
				.populate('schoolClasses', { title: 1 })
			response.status(200).json(updatedPupil.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = pupilsRouter