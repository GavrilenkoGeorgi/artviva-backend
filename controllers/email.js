const emailRouter = require('express').Router()
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const mailerCreds = {
	auth: {
		api_key: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN
	}
}

// send account activation email
emailRouter.post('/activation', async (request, response, next) => {

	const { name, email, activationUUID } = { ...request.body }

	if (!name || !email || !activationUUID) {
		return response.status(422).json({
			error: 'Не вдається надіслати електронний лист, деякі поля даних відсутні.'
		})
	} else {
		try {
			const nodemailerMailgun = nodemailer.createTransport(mg(mailerCreds))
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
				from: 'info@artviva.school',
				to: email,
				subject: 'Активація облікового запису на сайті ArtViva',
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
						message: `Повідомлення надіслано: ${info.message}`
					})
				}
			})

		} catch (exception) {
			next(exception)
		}
	}
})

// send contact email
emailRouter.post('/contact', async (request, response, next) => {

	const { name, email, message } = { ...request.body }

	if (!name || !email || !message) {
		return response.status(422).json({
			error: 'Не вдається надіслати електронний лист, деякі поля даних відсутні.'
		})
	} else {
		try {
			const nodemailerMailgun = nodemailer.createTransport(mg(mailerCreds))
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
						message: `Повідомлення не надіслано: ${error}`
					})
				}
				else {
					return response.status(200).json({
						message: `Повідомлення надіслано: ${info.message}`
					})
				}
			})

		} catch (exception) {
			next(exception)
		}
	}
})

module.exports = emailRouter
