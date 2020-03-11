const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const validateUserCreds = require('../utils/val_user_input').checkNameAndPass
const jwt = require('jsonwebtoken')
const requestPromise = require('request-promise')

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

// create user
usersRouter.post('/', async (request, response, next) => {
	try {
		const body = request.body

		if (validateUserCreds(body.email, body.name, body.middlename, body.lastname, body.password)) {
			const saltRounds = 10
			const passwordHash = await bcrypt.hash(body.password, saltRounds)
			const user = new User({
				email: body.email,
				name: body.name,
				middlename: body.middlename,
				lastname: body.lastname,
				passwordHash,
				activationHash: '',
				passResetHash: '',
				passResetHashExpiresAt: '',
			})

			const savedUser = await user.save()

			response.json(savedUser)
		} else {
			return response.status(400).json({ error: 'Перевірте ім\'я користувача та/або пароль.' })
		}
	} catch (exception) {
		next(exception)
	}
})

//get all users
usersRouter.get('/', async (request, response, next) => {
	const token = getTokenFrom(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Токен відсутній або недійсний.'
			})
		}

		const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
		response.json(users.map(user => user.toJSON()))
	} catch (exception) {
		next(exception)
	}
})

// verify user recaptcha score
usersRouter.post('/recaptcha/verify', async (request, response, next) => {
	try {
		const data = request.body

		if (!data.captchaResp) {
			return response.status(400).json({
				error: 'Відсутня відповідь recaptcha з фронтенда.'
			})
		}

		const options = {
			method: 'POST',
			uri: 'https://www.google.com/recaptcha/api/siteverify',
			form: {
				secret: process.env.RECAPTCHA_SECRET_KEY,
				response: data.captchaResp
			},
			json: true // Automatically stringifies the body to JSON
		}

		const result = await requestPromise(options)
		return response.status(200).json({ result })

	} catch (exception) {
		next(exception)
	}
})

module.exports = usersRouter
