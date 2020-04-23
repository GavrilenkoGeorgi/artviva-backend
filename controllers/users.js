const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { validateUserRegData, validateUUIDv4, validateEmail } = require('../utils/val_user_input')
const jwt = require('jsonwebtoken')
const requestPromise = require('request-promise')
const { v4: uuidv4 } = require('uuid')
const { hashString } = require('../utils/hashString')
const { sendAccountActivationMessage } = require('../utils/sendEmailMessage')

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
		// check if all data fields are present
		const {
			email,
			name,
			middlename,
			lastname,
			password
		} = { ...request.body }

		if (!email || !name || !middlename || !lastname || !password) {
			return response.status(400).json({
				message: 'У запиті відсутні деякі поля даних.'
			})
		}

		// check if email is correctly formatted
		if (!validateEmail(email)) return response.status(400).json({
			message: 'Електронна пошта користувача неправильно сформована.'
		})

		// check if email is already taken
		const existingUser = await User.findOne({ email })
		if (existingUser) return response.status(400).json({
			message: 'Адреса електронної пошти вже зайнята, вкажіть іншу.',
			cause: 'email'
		})

		if (validateUserRegData(email, name, middlename, lastname, password)) {
			const passwordHash = await hashString(password)
			const activationUUID = uuidv4()
			const activationHash = await hashString(activationUUID)
			const user = new User({
				email,
				name,
				middlename,
				lastname,
				passwordHash,
				activationHash
			})
			// save user
			await user.save()

			// send activation email
			const data = {
				name,
				email,
				activationUUID,
				response
			}
			sendAccountActivationMessage(data)  //???

		} else {
			return response.status(422).json({
				message: 'Електронна адреса користувача неправильно відформатована або пароль недостатньо надійний.'
			})
		}
	} catch (exception) {
		next(exception)
	}
})

// get all users
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

// get single user info
usersRouter.get('/:id', async (request, response, next) => {
	try {
		const id = request.params.id
		const user = await User.findOne({ _id: id })

		if (!user) return response.status(400).json({ error: 'Користувача не знайдено, перевірте ID.' })
		return response.status(200).json({ user })

	} catch(exception) {
		next(exception)
	}
})

// activate user account
usersRouter.post('/activate', async (request, response, next) => {
	try {
		const { email, activationToken } = { ...request.body }
		const user = await User.findOne({ email })

		if (!user) {
			return response.status(404).json({
				message: 'Користувача з цією електронною адресою не існує.'
			})
		}

		// check token
		if (!validateUUIDv4(activationToken)) {
			return response.status(422).send({
				message: 'UUID сформований неправильно.'
			})
		}
		const correctActivationToken = user === null
			? false
			: await bcrypt.compare(activationToken, user.activationHash)

		if (!correctActivationToken) {
			return response.status(400).send({
				message: 'UUID для активації користувача не відповідає тому, який знаходиться в базі даних.'
			})
		}

		// update user account
		const filter = { email }
		const update = {
			isActive: true,
			activationHash: null
		}

		await User.findOneAndUpdate(filter, update, { new: true })

		return response.status(200).json({
			message: 'Обліковий запис активовано.'
		})

	} catch(exception) {
		next(exception)
	}
})

// verify user recaptcha score
usersRouter.post('/recaptcha/verify', async (request, response, next) => {
	try {
		const { captchaResp } = { ...request.body }

		if (!captchaResp) {
			return response.status(400).json({
				error: 'Відсутня відповідь recaptcha з фронтенда.'
			})
		}

		const options = {
			method: 'POST',
			uri: 'https://www.google.com/recaptcha/api/siteverify',
			form: {
				secret: process.env.RECAPTCHA_SECRET_KEY,
				response: captchaResp
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
