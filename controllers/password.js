const bcrypt = require('bcrypt')
const passwordRouter = require('express').Router()
const User = require('../models/user')
const { validateEmail, validateUserPass, validateUUIDv4 }  = require('../utils/val_user_input')
const { v4: uuidv4 } = require('uuid')
const { passResetHashExpiry } = require('../utils/dateAndTime')
const { sendPassResetMessage } = require('../utils/sendEmailMessage')
const { sendAccountActivationMessage } = require('../utils/sendEmailMessage')
const { hashString } = require('../utils/hashString')

// send account activation email
passwordRouter.post('/activation', async (request, response, next) => {

	const { name, email, activationUUID } = { ...request.body }

	if (!name || !email || !activationUUID) {
		return response.status(422).json({
			message: 'Не вдається надіслати електронний лист, деякі поля даних відсутні.'
		})
	} else {
		try {
			// send activation message
			const data = {
				name,
				email,
				activationUUID,
				response
			}
			sendAccountActivationMessage(data)
		} catch (exception) {
			next(exception)
		}
	}
})

// send password reset email
passwordRouter.post('/recover', async (request, response, next) => {

	const { email } = { ...request.body }

	if (!email) {
		return response.status(400).json({
			error: 'Відсутня електронна адреса користувача.'
		})
	} else if (!validateEmail(email)) {
		return response.status(422).json({
			error: 'Email не є допустимим.'
		})
	} else {
		try {
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
				passResetToken,
				response
			}

			sendPassResetMessage(data)
		} catch (exception) {
			next(exception)
		}
	}
})

// reset password
passwordRouter.post('/reset', async (request, response, next) => {

	const { email, passResetToken, password } = { ...request.body }

	// check if all data fields are present
	if (!email || !passResetToken || !password) {
		return response.status(400).send({
			message: 'Поля email, пароля або UUID відсутні.'
		})
	} else if (!validateUUIDv4(passResetToken)
			|| !validateUserPass(password)
			|| !validateEmail(email)) {
		return response.status(422).send({
			message: 'Email, пароль або UUID не відповідають дійсній схемі.'
		})
	}

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return response.status(404).json({
				error: 'Користувача з цією електронною адресою не існує.'
			})
		}

		// check token
		const correctResetToken = user === null
			? false
			: await bcrypt.compare(passResetToken, user.passResetHash)

		if (!correctResetToken) {
			return response.status(400).send({
				message: 'UUID не відповідає тому, який знаходиться в базі даних.'
			})
		}

		// check if it is expired
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
