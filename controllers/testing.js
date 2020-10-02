const router = require('express').Router()
const jwt = require('jsonwebtoken')

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
