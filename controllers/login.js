const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {

	try {
		const body = request.body
		const user = await User.findOne({ email: body.email })

		if (!body.password || !body.email) {
			return response.status(400).json({
				error: 'router is missing user data'
			})
		}

		const passwordCorrect = user === null
			? false
			: await bcrypt.compare(body.password, user.passwordHash)

		if (!(user && passwordCorrect)) {
			return response.status(401).json({
				error: 'Невірна адреса електронної пошти або пароль.'
			})
		} else {
			const userForToken = {
				email: user.email,
				id: user.id
			}
			const token = jwt.sign(userForToken, process.env.SECRET)

			return response
				.status(200)
				.send({
					token,
					name: user.name,
					middlename: user.middlename,
					lastname: user.lastname,
					email: user.email,
					id: user.id
				})
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = loginRouter
