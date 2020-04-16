const specialtiesRouter = require('express').Router()
const Specialty = require('../models/specialty')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

specialtiesRouter.post('/', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const { name, cost } = { ...request.body }

		if (!name || !cost ) {
			return response.status(400).send({
				error: 'Деякі поля даних відсутні.'
			}).end()
		}

		const specialty = new Specialty(request.body)
		// const newSpecialty = await specialty.save()
		await specialty.save()

		return response.status(200).json({ specialty })

	} catch (exception) {
		next(exception)
	}
})

module.exports = specialtiesRouter
