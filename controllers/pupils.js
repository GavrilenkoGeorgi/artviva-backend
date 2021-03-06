const pupilsRouter = require('express').Router()
const Pupil = require('../models/pupil')
const Specialty = require('../models/specialty')
const { checkAuth } = require('../utils/checkAuth')
const { checkAllPropsArePresent } = require('../utils/objectHelpers')
const { sendNewPupilMessage, sendPublicApplyFeedbackMessage } = require('../utils/sendEmailMessage')


const getSpecId = async (specialty) => {
	const { id } = await Specialty.findOne({ title: specialty }, 'id')
	return id
}

// create new pupil
pupilsRouter.post('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const { name } = { ...request.body }
			// check if pupil with this name already exists
			const existingPupil = await Pupil.findOne({ name })
			if (existingPupil) return response.status(409).json({
				message: 'Учень з таким ім’ям вже існує.',
				cause: 'name'
			})

			const specId = await getSpecId(request.body.specialty)
			if (!specId) return response.status(404).json({
				message: 'Спеціальності з таким ім\'ям не знайдено.',
				cause: 'specialty'
			})

			const pupil = new Pupil({ ...request.body, specialty: specId })
			await pupil.save()

			const newlyCreatedPupil =
				await Pupil.findOne({ name })
					.populate({ path: 'assignedTo', select: 'email name lastname middlename' })
					.populate({ path: 'teachers', select: 'name' })
					.populate({ path: 'specialty', select: 'title' })
					.populate({ path: 'schoolClasses', select: 'title',
						populate: [{ path: 'teacher', select: 'name' },
							{ path: 'specialty', select: 'title' }] })

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
		checkAllPropsArePresent(request.body, pupilsData)

		// check if pupil with this name already exists
		const { name } = { ...request.body }
		const existingPupil = await Pupil.findOne({ name })
		if (existingPupil) return response.status(409).json({
			message: 'Учень з таким ім’ям вже існує.',
			cause: 'name'
		})

		const specId = await getSpecId(request.body.specialty)
		if (!specId) return response.status(404).json({
			message: 'Спеціальності з таким ім\'ям не знайдено.',
			cause: 'specialty'
		})

		// send email to admin about new pupil added by public form!
		const { applicantName, contactEmail } = { ...request.body }
		const data = {
			name,
			applicantName,
			contactEmail
		}
		// send email
		// if unsuccessfull, throws an error
		// and pupil is not saved
		await sendNewPupilMessage(data)
		await sendPublicApplyFeedbackMessage(data)

		// create new pupil and save
		const pupil = new Pupil({ ...request.body, specialty: specId })
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
				.populate({ path: 'assignedTo', select: 'email name lastname middlename' })
				.populate({ path: 'teachers', select: 'name' })
				.populate({ path: 'specialty', select: 'title' })
				.populate({ path: 'schoolClasses', select: 'title',
					populate: [{ path: 'teacher', select: 'name' },
						{ path: 'specialty', select: 'title' }] })
			response.status(200).send(pupils)
		}
	} catch (exception) {
		next(exception)
	}
})

// get all pupils with given user id
pupilsRouter.get('/user/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const pupils = await Pupil
				.find({ assignedTo: request.params.id })
				.populate({ path: 'assignedTo', select: 'email name lastname middlename' })
				.populate({ path: 'teachers', select: 'name' })
				.populate({ path: 'specialty', select: 'title' })
				.populate({ path: 'schoolClasses', select: 'title',
					populate: [{ path: 'teacher', select: 'name' },
						{ path: 'specialty', select: 'title' }] })
			response.status(200).send(pupils)
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

// get pupil details
pupilsRouter.get('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const pupil = await Pupil.findById(request.params.id)
				.populate({ path: 'assignedTo', select: 'email name lastname middlename' })
				.populate({ path: 'teachers', select: 'name' })
				.populate({ path: 'specialty', select: 'title' })
				.populate({ path: 'schoolClasses', select: 'title', populate: { path: 'teacher', select: 'name' } })
			if (!pupil) return response.status(404)
				.send({ message: 'Учня із цим ідентифікатором не знайдено.' })
			response.status(200).json(pupil)
		}
	} catch (exception) {
		next(exception)
	}
})

// get pupil f1-form data
pupilsRouter.get('/f1/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const f1Fields = `name applicantName
				homeAddress dateOfBirth
				specialty mainSchool mainSchoolClass
				fathersName fathersEmploymentInfo fathersPhone
				mothersName mothersEmploymentInfo mothersPhone`
			const pupil = await Pupil.findById(request.params.id)
				.select(f1Fields).populate({ path: 'specialty', select: 'title' })
			if (!pupil) return response.status(404)
				.send({ message: 'Учня із цим ідентифікатором не знайдено.' })
			response.status(200).json(pupil)
		}
	} catch (exception) {
		next(exception)
	}
})

// update pupil details
pupilsRouter.put('/:id', async (request, response, next) => {
	try {
		if(checkAuth(request)) {

			const specId = await getSpecId(request.body.specialty)
			if (!specId) return response.status(404).json({
				message: 'Спеціальності з таким ім\'ям не знайдено.',
				cause: 'specialty'
			})

			const updatedPupil = await Pupil
				.findByIdAndUpdate(request.params.id, { ...request.body, specialty: specId }, { new: true })
				.populate({ path: 'assignedTo', select: 'email name lastname middlename' })
				.populate({ path: 'teachers', select: 'name' })
				.populate({ path: 'specialty', select: 'title' })
				.populate({ path: 'schoolClasses', select: 'title',
					populate: [{ path: 'teacher', select: 'name' },
						{ path: 'specialty', select: 'title' }] })

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
