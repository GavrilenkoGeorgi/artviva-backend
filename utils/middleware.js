const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'Шлях не знайдено.' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return response.status(400).send({
			message: 'Перевірте вказаний вами ідентифікатор. Схоже, це неправильний формат.'
		})
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({
			message: `Помилка перевірки: ${error.message}`
		})
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({
			message: 'Неаутентифіковані. Маркер відсутній або недійсний.'
		})
	} else if (error.name === 'MongoError' && error.codeName === 'DuplicateKey') {
		const value = error.keyValue
		return response.status(409).json({
			message: `Це значення має бути унікальним: "${value[Object.keys(value)[0]]}"`
		})
	} else if (error.name === 'MailGunError') {
		return response.status(500).json({
			message: error.message
		})
	} else if (error.name === 'ObjectPropsCheck') {
		return response.status(500).json({
			message: error.message
		})
	}

	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
}
