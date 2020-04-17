const branchesRouter = require('express').Router()
const Branch = require('../models/branch')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

// add new branch
branchesRouter.post('/', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).send({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const { name, town, address, phone, info, latitude, longitude, image } = { ...request.body }

		if (!name // this doesn't spark joy
			|| !town
			|| !address
			|| !phone
			|| !info
			|| !latitude
			|| !longitude
			|| !image)
		{
			return response.status(400).send({
				error: 'Деякі поля даних відсутні.'
			})
		}

		const branch = new Branch(request.body)
		console.log('Saving branch', branch)
		// await branch.save()
		return response.status(200).send({ branch })

	} catch (exception) {
		next(exception)
	}
})

// get all branches
branchesRouter.get('/', async (request, response) => {
	const branches = await Branch
		.find({})
		.populate('teachers', { name: 1 })
	return response.send(branches.map(branch => branch.toJSON()))
})

// delete branch
branchesRouter.delete('/:id', async (request, response, next) => {

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).send({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const branch = await Branch.findById(request.params.id)

		if (!branch) {
			return response.status(404).send({ error: 'Branch not found' })
		} /* else if (branch.user.toString() !== decodedToken.id.toString()) {
			return response.status(400).send({ error: 'Not allowed to delete branches' })
		}*/

		await Branch.findByIdAndRemove(branch.id)
		return response.status(204).end()

	} catch (exception) {
		next(exception)
	}
})

module.exports = branchesRouter
