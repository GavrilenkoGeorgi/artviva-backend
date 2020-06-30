const emailRouter = require('express').Router()
const { checkAuth } = require('../utils/checkAuth')
const { sendContactMessage, sendTestMessage } = require('../utils/sendEmailMessage')
const { checkAllPropsArePresent } = require('../utils/objectHelpers')

// send contact email
emailRouter.post('/contact', async (request, response, next) => {
	try {
		const messageFields = ['name', 'email', 'message']
		checkAllPropsArePresent(request.body, messageFields)

		const result = await sendContactMessage(request.body)
		response.status(200).send(result)
	} catch (exception) {
		next(exception)
	}
})

// just for testing
emailRouter.post('/test', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const messageFields = ['to', 'text']
			checkAllPropsArePresent(request.body, messageFields)

			const messageData = { ...request.body }
			const result = await sendTestMessage(messageData)
			response.status(200).send(result)
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = emailRouter
