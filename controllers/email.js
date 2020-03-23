const emailRouter = require('express').Router()
const { sendContactMessage } = require('../utils/sendEmailMessage')

// send contact email
emailRouter.post('/contact', async (request, response, next) => {

	const { name, email, message } = { ...request.body }

	if (!name || !email || !message) {
		return response.status(422).json({
			error: 'Не вдається надіслати електронний лист, деякі поля даних відсутні.'
		})
	} else {
		try {
			const data = {
				name,
				email,
				message,
				response
			}
			sendContactMessage(data)
		} catch (exception) {
			next(exception)
		}
	}
})

module.exports = emailRouter
