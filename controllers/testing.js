const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { hashString } = require('../utils/hashString')

router.post('/reset', async (request, response) => {
	await User.deleteMany({})

	const user = new User({
		email: 'test@example.com',
		name: 'Joe',
		middlename: 'Tester',
		lastname: 'Doe',
		isActive: true,
		approvedUser: true,
		passwordHash: await hashString('TestPassword1')
	})
	await user.save()
	response.status(204).end()
})

router.post('/login', async (request, response) => {
	const {
		email,
		password
	} = { ...request.body }

	const testUserToken = {
		email: email,
		id: password //use pwd as test id
	}

	const token = jwt.sign(testUserToken, process.env.SECRET)
	response.status(200).send({ token })
})

module.exports = router
