const bcrypt = require('bcrypt')
const passwordRouter = require('express').Router()
const User = require('../models/user')
const { validateEmail, validateUserPass, validateUUIDv4 }  = require('../utils/val_user_input')
const { v4: uuidv4 } = require('uuid')
const { passResetHashExpiry } = require('../utils/dateAndTime')
const { sendPassResetMessage } = require('../utils/sendEmailMessage')
const { hashString } = require('../utils/hashString')

// send password reset email
passwordRouter.post('/recover', async (request, response, next) => {
	try {
		const { email } = { ...request.body }

		if (!email) {
			return response.status(400).json({
				message: 'Поле даних електронної пошти відсутнє.'
			})
		} if (!validateEmail(email)) {
			return response.status(422).json({
				message: 'Email не є допустимим.'
			})
		}

		// generate pass reset data
		const passResetToken = uuidv4()
		const hashedPassResetToken = await hashString(passResetToken)
		const expiryDate = new Date(passResetHashExpiry(1)) // now plus one hour

		// find and update user record
		const filter = { email }
		const update = {
			passResetHash: hashedPassResetToken,
			passResetHashExpiresAt: expiryDate
		}
		const user = await User.findOneAndUpdate(filter, update, { new: true })
		if (!user) {
			return response.status(404).json({
				message: 'Користувач не знайдений.'
			})
		}

		// send email
		const data = {
			name: user.name,
			email,
			passResetToken
		}

		await sendPassResetMessage(data)

		if (process.env.NODE_ENV === 'test')
			response.status(200).send({ passResetToken })

		response.status(200).end()
	} catch (exception) {
		next(exception)
	}
})

// reset password
passwordRouter.post('/reset', async (request, response, next) => {
	try {
		const { email, passResetToken, password } = { ...request.body }

		// check if all data fields are present
		if (!email || !passResetToken || !password) {
			return response.status(400).send({
				message: 'Поля email, пароля або UUID відсутні.'
			})
		}

		if (!validateUUIDv4(passResetToken)
				|| !validateUserPass(password)
				|| !validateEmail(email)) {
			response.status(422).send({
				message: 'Email, пароль або UUID не відповідають дійсній схемі.'
			})
		}

		// check if user exists
		const user = await User.findOne({ email })
		if (!user) {
			return response.status(404).json({
				message: 'Користувача з цією електронною адресою не існує.'
			})
		}

		// check token
		const correctResetToken = user.passResetHash === null
			? false
			: await bcrypt.compare(passResetToken, user.passResetHash)

		if (!correctResetToken) {
			return response.status(400).send({
				message: 'Ви вже використовували це посилання для скидання пароля, або UUID у посиланні не відповідає тому, який знаходиться в базі даних.'
			})
		}

		// check if reset token is expired
		const dateNow = new Date()
		const tokenIsExpired = dateNow > user.passResetHashExpiresAt
			? true
			: false

		if (tokenIsExpired) {
			return response.status(400).send({
				message: 'Термін дії скидання пароля минув, спробуйте ще раз.'
			})
		}

		// generate new password hash
		const passwordHash = await hashString(password)

		// find and update user by email
		const filter = { email }
		const update = {
			passwordHash,
			passResetHash: null,
			passResetHashExpiresAt: null
		}

		const updatedUser = await User.findOneAndUpdate(filter, update, { new: true })
		return response.status(200).json({
			message: 'Пароль успішно скинуто.',
			updatedUser
		})

	} catch (exception) {
		next (exception)
	}
})

module.exports = passwordRouter
