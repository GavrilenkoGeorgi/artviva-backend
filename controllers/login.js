const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {

	try {
		const body = request.body
		console.log('Request body is', request.body)
		console.log('Email to search', body.email)
		const user = await User.findOne({ email: body.email })

		const passwordCorrect = user === null
			? false
			: await bcrypt.compare(body.password, user.passwordHash)

		if (!(user && passwordCorrect)) {
			return response.status(401).json({
				error: 'invalid username or password'
			})
		} else {
			console.log('User id is: ', user.id)
			const userForToken = {
				email: user.email,
				id: user.id
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			return response
				.status(200)
				.send({ token, username: user.username, email: user.email, id: user.id })
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = loginRouter
