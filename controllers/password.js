const bcrypt = require('bcrypt')
const passwordRouter = require('express').Router()
const User = require('../models/user')
const validEmail = require('../utils/val_user_input').validateEmail
const { v4: uuidv4 } = require('uuid')
const passResetHashExpiry = require('../utils/dateAndTime').passResetHashExpiry
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const mailerCreds = require('../utils/mailerCreds').mailerCreds

passwordRouter.post('/recover', async (request, response, next) => {

	const body = request.body
	if (!body.email) {
		return response.status(400).json({
			error: 'Відсутня електронна адреса користувача.'
		})
	} else if (!validEmail(body.email)) {
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
			const filter = { email: body.email }
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

			// send email message with link
			const nodemailerMailgun = nodemailer.createTransport(mg(mailerCreds))
			const htmlOutput = `
				<h1>Скидання пароля на сайті ArtViva</h1>
				<ul>
					<li>
						Добрий день, ${user.name}.
					</li>
					<li>
						Щоб скинути пароль, натисніть на посилання: https://artviva.herokuapp.com/activate/${passResetToken}
					</li>
				</ul>`
			const textOutput = `Добрий день, ${user.name}. Щоб скинути пароль, натисніть на посилання: https://artviva.herokuapp.com/activate/${passResetToken}`

			nodemailerMailgun.sendMail({
				from: 'info@artviva.school',
				to: body.email,
				subject: 'Скидання пароля на сайті ArtViva',
				text: textOutput,
				html: htmlOutput
			}, (error, info) => {
				if (error) {
					return response.status(400).json({
						message: `Повідомлення не надіслано: ${error}`
					})
				}
				else {
					return response.status(200).json({
						message: `Електронна пошта для скидання пароля надіслана: ${info.message}`,
						user
					})
				}
			})
		} catch (exception) {
			next(exception)
		}
	}
})

module.exports = passwordRouter
