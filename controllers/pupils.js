const pupilsRouter = require('express').Router()
const Pupil = require('../models/pupil')
const { checkAuth } = require('../utils/checkAuth')
const { checkAllPropsArePresent } = require('../utils/objectHelpers')

// create new pupil
pupilsRouter.post('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const { name } = { ...request.body }
			// check if pupil with this name already exists
			const existingPupil = await Pupil.findOne({ name })
			if (existingPupil) return response.status(400).json({
				message: 'Учень з таким ім’ям вже існує.',
				cause: 'name'
			})

			const pupil = new Pupil(request.body)
			await pupil.save()

			const newlyCreatedPupil =
				await Pupil.findOne({ name })
					.populate('specialty', { title: 1 })

			response.status(200).send(newlyCreatedPupil.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// create new pupil from public form
pupilsRouter.post('/apply', async (request, response, next) => {
	try {
		const pupilsData =
			['name', 'applicantName', 'specialty', 'dateOfBirth', 'mainSchool',
				'mainSchoolClass', 'gender', 'hasBenefit',
				'fathersName', 'fathersPhone', 'fathersEmploymentInfo',
				'mothersName', 'mothersPhone', 'mothersEmploymentInfo',
				'contactEmail', 'homeAddress']
		// check all fields are present
		try {
			checkAllPropsArePresent(request.body, pupilsData)
		} catch (error) {
			return response.status(400).json({ message: error })
		}

		// check if pupil with this name already exists
		const { name } = { ...request.body }
		const existingPupil = await Pupil.findOne({ name })
		if (existingPupil) return response.status(400).json({
			message: 'Учень з таким ім’ям вже існує.',
			cause: 'name'
		})

		// send email to admin about new pupil added by public form!

		// create new pupil and save
		const pupil = new Pupil(request.body)
		await pupil.save()

		response.status(200).end()
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
				.populate('specialty', { title: 1 })

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
				return response.status(404)
					.send({ message: 'Учня із цим ідентифікатором не знайдено.' })
			} else if (pupil.schoolClasses.length > 0) {
				return response.status(409)
					.send({ message: 'Неможливо видалити учня, видаліть його з класу, а потім спробуйте ще раз.' })
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
				.populate('specialty', { title: 1 })

			if (!updatedPupil)
				return response.status(404)
					.send({ message: 'Учня із цим ідентифікатором не знайдено.' })

			response.status(200).json(updatedPupil.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = pupilsRouter
