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

		const { name, town, address, phone, info } = { ...request.body }

		if (!name // this doesn't spark joy
			|| !town
			|| !address
			|| !phone
			|| !info)
		{
			return response.status(400).send({
				error: 'Деякі поля даних відсутні.'
			})
		}

		// check if branch name is already taken
		const existingBranch = await Branch.findOne({ name })
		if (existingBranch) return response.status(400).json({
			message: 'Філія вже існує.',
			cause: 'name'
		})

		const branch = new Branch(request.body)
		await branch.save()
		return response.status(200).send(branch.toJSON())

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
			return response.status(404).send({ error: 'Філія з цім ID не знайдена.' })
		} /* else if (branch.user.toString() !== decodedToken.id.toString()) {
			return response.status(400).send({ error: 'Not allowed to delete branches' })
		} */

		await Branch.findByIdAndRemove(branch.id)
		return response.status(204).end()

	} catch (exception) {
		next(exception)
	}
})

// update branch details
branchesRouter.put('/:id', async (request, response, next) => {
	try {
		const updatedBranch = await Branch
			.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
			// .populate('user', { username: 1, name: 1 })
		return response.status(200).json(updatedBranch.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = branchesRouter
