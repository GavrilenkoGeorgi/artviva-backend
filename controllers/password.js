const bcrypt = require('bcrypt')
const passwordRouter = require('express').Router()
const User = require('../models/user')
const validEmail = require('../utils/val_user_input').validateEmail
const { v4: uuidv4 } = require('uuid')
const passResetHashExpiry = require('../utils/dateAndTime').passResetHashExpiry
const sendPassResetMessage = require('../utils/sendEmailMessage').sendPassResetMessage
const sendAccountActivationMessage = require('../utils/sendEmailMessage').sendAccountActivationMessage

// send account activation email
passwordRouter.post('/activation', async (request, response, next) => {

	const { name, email, activationUUID } = { ...request.body }

	if (!name || !email || !activationUUID) {
		return response.status(422).json({
			error: 'Не вдається надіслати електронний лист, деякі поля даних відсутні.'
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
	} else if (!validEmail(email)) {
		return response.status(422).json({
			error: 'Email не є допустимим.'
		})
	} else {
		try {
			// generate pass reset data
			const passResetToken = uuidv4()
			const saltRounds = 10
			const hashedPassResetToken = await bcrypt.hash(passResetToken, saltRounds)
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
					error: 'Користувач не знайдений.'
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

module.exports = passwordRouter
