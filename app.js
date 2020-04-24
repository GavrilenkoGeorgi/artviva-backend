const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const teachersRouter = require('./controllers/teachers')
const pupilsRouter = require('./controllers/pupils')
const branchesRouter = require('./controllers/branches')
const specialtiesRouter = require('./controllers/specialties')
const loginRouter = require('./controllers/login')
const emailRouter = require('./controllers/email')
const paymentRouter = require('./controllers/payment')
const passwordRouter = require('./controllers/password')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const path = require('path')

logger.info('connecting to', config.MONGODB_URI)

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connection to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing')
	app.use('/api/testing', testingRouter)
}

app.use('/api/users', usersRouter)
app.use('/api/teachers', teachersRouter)
app.use('/api/pupils', pupilsRouter)
app.use('/api/branches', branchesRouter)
app.use('/api/specialties', specialtiesRouter)
app.use('/api/login', loginRouter)
app.use('/api/email', emailRouter)
app.use('/api/password', passwordRouter)
app.use('/api/payment', paymentRouter)

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'build')))
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'))
	})
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
