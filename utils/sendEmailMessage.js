const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const mailerCreds = require('../utils/mailerCreds').mailerCreds

const nodemailerMailgun = nodemailer.createTransport(mg(mailerCreds))

/**
 * Send email with account activation instructions
 *
 * @param {string} name - User name.
 * @param {string} email - User email to send message to.
 * @param {string} activationUUID - Activation UUID of the user account.
 * @param {Object} response - Response to return.
 *
 * @returns {Object} - Response with appropriate status code.
 */

const sendAccountActivationMessage= ({ name, email, activationUUID, response }) => {

	const htmlOutput = `
		<h1>Активація облікового запису на сайті ArtViva</h1>
		<ul>
			<li>
				Добрий день, ${name}.
			</li>
			<li>
				Щоб активувати свій обліковий запис, натисніть на посилання: https://artviva.herokuapp.com/activate/${activationUUID}
			</li>
		</ul>`
	const textOutput = `Добрий день, ${name}. Щоб активувати свій обліковий запис, натисніть на посилання: https://artviva.herokuapp.com/activate/${activationUUID}`

	nodemailerMailgun.sendMail({
		from: process.env.PROD_EMAIL,
		to: email,
		subject: 'Активація облікового запису на сайті ArtViva',
		text: textOutput,
		html: htmlOutput
	}, (error, info) => {
		if (error) {
			return response.status(400).json({
				message: `Повідомлення не надіслано: ${error.statusCode} ${error}`
			})
		}
		else {
			return response.status(200).json({
				message: `Повідомлення надіслано: ${info.message}`
			})
		}
	})
}

/**
 * Send pass reset email message with link
 *
 * @param {string} name - User name.
 * @param {string} email - User email to send message to.
 * @param {string} passResetToken - Unique password reset token.
 * @param {Object} response - Response object to return.
 *
 * @returns {Object} response
 */

const sendPassResetMessage = ({ name, email, passResetToken, response }) => {

	const htmlOutput = `
		<h1>Скидання пароля на сайті ArtViva</h1>
		<ul>
			<li>
				Добрий день, ${name}.
			</li>
			<li>
				Щоб скинути пароль, натисніть на посилання: https://artviva.herokuapp.com/reset/${email}/${passResetToken}
			</li>
			<li>
			 <a href="https://artviva.herokuapp.com/reset/${email}/${passResetToken}">Human readable</a>
			</li>
		</ul>`
	const textOutput = `Добрий день, ${name}. Щоб скинути пароль, натисніть на посилання: https://artviva.herokuapp.com/reset//${email}/${passResetToken}`

	nodemailerMailgun.sendMail({
		from: 'info@artviva.school',
		to: email,
		subject: 'Скидання пароля на сайті ArtViva',
		text: textOutput,
		html: htmlOutput
	}, (error, info) => {
		if (error) {
			return response.status(400).json({
				message: `Повідомлення не надіслано: ${error.statusCode} ${error}`
			})
		}
		else {
			return response.status(200).json({
				message: `Електронна пошта для скидання пароля надіслана: ${info.message}`
			})
		}
	})
}

/**
 * Send contact form email message to the designated artviva info email
 *
 * @param {string} name - User name.
 * @param {string} email - User email to send message to.
 * @param {string} message - Message to send.
 * @param {Object} response - Response to return.
 *
 * @returns {Object} - Response with appropriate status code.
 */

const sendContactMessage = ({ name, email, message, response }) => {

	const htmlOutput = `
		<h1>Контактна форма сайту ArtViva</h1>
		<ul>
			<li>
				Від: ${name}
			</li>
			<li>
				Електронна пошта: ${email}
			</li>
			<li>
				Повідомлення: ${message}
			</li>
		</ul>`

	const textOutput = `У вас є повідомлення від ${name}. Електронна пошта: ${email} Повідомлення: ${message}`

	nodemailerMailgun.sendMail({
		from: email,
		to: process.env.TEST_EMAIL,
		subject: 'Повідомлення з сайту ArtViva',
		text: textOutput,
		html: htmlOutput
	}, (error, info) => {
		if (error) {
			return response.status(400).json({
				message: `Повідомлення не надіслано: ${error.statusCode} ${error}`
			})
		}
		else {
			return response.status(200).json({
				message: `Повідомлення надіслано: ${info.message}`
			})
		}
	})
}

module.exports = {
	sendPassResetMessage,
	sendContactMessage,
	sendAccountActivationMessage
}
