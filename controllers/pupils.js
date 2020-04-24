const pupilsRouter = require('express').Router()
const Pupil = require('../models/pupil')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// create new pupil
pupilsRouter.post('/', async (request, response, next) => {

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
		const existingPupil = await Pupil.findOne({ name })
		if (existingPupil) return response.status(400).json({
			message: 'Учень з таким ім’ям вже існує.',
			cause: 'name'
		})

		const pupil = new Pupil(request.body)
		await pupil.save()

		return response.status(200).send(pupil.toJSON())

	} catch (exception) {
		next(exception)
	}
})

// get all pupils
pupilsRouter.get('/', async (request, response) => {
	const pupils = await Pupil
		.find({})
		// .populate('user', { username: 1, name: 1 })
		// .populate('comments', { content: 1 })
	return response.send(pupils.map(pupil => pupil.toJSON()))
})

// delete single pupil
pupilsRouter.delete('/:id', async (request, response, next) => {
	const token = getTokenFromReq(request)
	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'Неаутентифіковані. Маркер відсутній або недійсний.' })
		}

		const pupil = await Pupil.findById(request.params.id)

		if (!pupil) {
			return response.status(404).send({ error: 'Учня із цим ідентифікатором не знайдено.' })
		}

		await Pupil.findByIdAndRemove(pupil._id)
		response.status(204).end()

	} catch (exception) {
		next(exception)
	}
})

// update pupil details
pupilsRouter.put('/:id', async (request, response, next) => {
	try {
		const updatedPupil = await Pupil
			.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
		return response.status(200).json(updatedPupil.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = pupilsRouter
