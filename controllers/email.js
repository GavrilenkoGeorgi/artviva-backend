const emailRouter = require('express').Router()
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

emailRouter.post('/contact', async (request, response, next) => {

	const { name, email, message } = { ...request.body }

	if (!name || !email || !message) {
		return response.status(422).json({
			error: 'Не вдається надіслати електронний лист, деякі поля даних відсутні.'
		})
	} else {
		try {
			const creds = {
				auth: {
					api_key: process.env.MAILGUN_API_KEY,
					domain: process.env.MAILGUN_DOMAIN
				}
			}

			const nodemailerMailgun = nodemailer.createTransport(mg(creds))

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
