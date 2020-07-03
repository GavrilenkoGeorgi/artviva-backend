const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { validateUserRegData, validateUUIDv4, validateEmail } = require('../utils/val_user_input')
const requestPromise = require('request-promise')
const { v4: uuidv4 } = require('uuid')
const { hashString } = require('../utils/hashString')
const { sendAccountActivationMessage } = require('../utils/sendEmailMessage')
const { checkAuth } = require('../utils/checkAuth')
const { checkAllPropsArePresent } = require('../utils/objectHelpers')
const Teacher = require('../models/teacher')

// create user
usersRouter.post('/', async (request, response, next) => {
	try {
		// check if all data fields are present
		const newUserData = ['email', 'name', 'middlename', 'lastname', 'password']
		checkAllPropsArePresent(request.body, newUserData)

		const {
			email,
			name,
			middlename,
			lastname,
			password
		} = { ...request.body }

		// check if email is correctly formatted
		if (!validateEmail(email)) return response.status(400).json({
			message: 'Електронна пошта користувача неправильно сформована.'
		})

		// check if email is already taken
		const existingUser = await User.findOne({ email })
		if (existingUser) return response.status(409).json({
			message: 'Адреса електронної пошти вже зайнята, вкажіть іншу.',
			cause: 'email'
		})

		if (validateUserRegData(request.body)) {
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

			// send activation email
			const data = {
				name,
				email,
				activationUUID,
				response
			}
			// send message with details about activation
			// of newly created user account
			await sendAccountActivationMessage(data)

			// message sent, no errors, add new user account
			await user.save()
			response.status(200).end()

		} else {
			return response.status(422).json({
				message: 'Електронна адреса користувача неправильно відформатована або пароль недостатньо надійний.'
			})
		}
	} catch (exception) {
		next(exception)
	}
})

// get list of all users
usersRouter.get('/', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const users = await User.find({})
			response.json(users.map(user => user.toJSON()))
		}
	} catch (exception) {
		next(exception)
	}
})

// update user details
usersRouter.put('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			// check if all data fields are present
			const id = request.params.id
			const {
				name,
				middlename,
				lastname,
				teacher
			} = { ...request.body }

			if (!name || !middlename || !lastname) {
				return response.status(400).json({
					message: 'У запиті відсутні деякі поля даних.'
				})
			}

			let values = request.body
			if (teacher === '') {
				values = { ...values, teacher: null }
			} else {
				const foundTeacher = await Teacher.findOneAndUpdate({ name: teacher }, { linkedUserAccountId: id })
				if (!foundTeacher) return response.status(404)
					.send({ message: 'Перевірте ім\'я вчителя в полі анкети.' })
				values = { ...values, teacher: foundTeacher._id }
			}

			const updatedUser = await User
				.findOneAndUpdate({ _id: id }, values, { new: true })

			if (!updatedUser)
				return response.status(400)
					.json({ message: 'Щось пішло не так під час обробки вашого запиту.' })

			response.status(200).json({ updatedUser })
		}
	} catch(exception) {
		next(exception)
	}
})

// get single user info
usersRouter.get('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const id = request.params.id
			const user = await User.findOne({ _id: id })

			if (!user) return response.status(400).json({ message: 'Користувача не знайдено, перевірте ID.' })
			response.status(200).json(user)
		}
	} catch(exception) {
		next(exception)
	}
})

// delete single user by given id
usersRouter.delete('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			// const id = request.params.id
			const user = await User.findById(request.params.id)

			if (!user) return response.status(400).json({ message: 'Користувача не знайдено, перевірте ID.' })
			await User.findByIdAndRemove(user._id)
			response.status(204).end()
		}
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

		response.status(200).json({
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
				message: 'Відсутня відповідь recaptcha з фронтенда.'
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
		response.status(200).json(result)

	} catch (exception) {
		next(exception)
	}
})

module.exports = usersRouter
