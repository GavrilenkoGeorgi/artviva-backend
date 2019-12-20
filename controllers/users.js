const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const validateUserCreds = require('../utils/val_user_input').checkNameAndPass

usersRouter.post('/', async (request, response, next) => {
	try {
		const body = request.body

		if (validateUserCreds(body.email, body.username, body.password)) {
			const saltRounds = 10
			const passwordHash = await bcrypt.hash(body.password, saltRounds)
			const user = new User({
				email: body.email,
				username: body.username,
				passwordHash,
			})

			const savedUser = await user.save()

			response.json(savedUser)
		} else {
			return response.status(400).json({ error: 'check username and/or password input' })
		}
	} catch (exception) {
		next(exception)
	}
})

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
	response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter
