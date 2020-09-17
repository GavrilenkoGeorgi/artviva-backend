const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { checkAuth } = require('../utils/checkAuth')

loginRouter.post('/', async (request, response, next) => {

	try {
		const {
			email,
			password
		} = { ...request.body }

		if (!password || !email) {
			return response.status(400).json({
				message: 'Відсутні необхідні поля даних.'
			})
		}

		if (process.env.NODE_ENV === 'test') {
			const testUserToken = {
				email: email,
				id: password //use pwd as test id
			}
			const token = jwt.sign(testUserToken, process.env.SECRET)
			return response.status(200).send({ token })
		}

		const user = await User.findOne({ email: email })

		const passwordCorrect = user === null
			? false
			: await bcrypt.compare(password, user.passwordHash)

		if (!(user && passwordCorrect)) {
			return response.status(401).json({
				message: 'Невірна адреса електронної пошти або пароль.'
			})
		} else if (!user.isActive) {
			return response.status(401).json({
				message: 'Ви повинні активувати свій акаунт, щоб мати можливість увійти.',
				variant: 'warning'
			})
		} else if (!user.approvedUser) return response.status(401).json({
			message: 'Зачекайте, коли адміністратор сайту перегляне та затвердить ваш обліковий запис.',
			variant: 'warning'
		})

		const userForToken = {
			email: user.email,
			id: user.id
		}
		const token = jwt.sign(userForToken, process.env.SECRET)

		return response
			.status(200)
			.send({
				token,
				name: user.name,
				middlename: user.middlename,
				lastname: user.lastname,
				email: user.email,
				approvedUser: user.approvedUser,
				superUser: user.superUser,
				isActive: user.isActive,
				teacher: user.teacher,
				id: user.id
			})

	} catch (exception) {
		next(exception)
	}
})

// refresh user data after account changes
loginRouter.post('/refresh/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const user = await User.findById(request.params.id)
			if (!user) {
				return response.status(404).json({
					message: 'Користувача із цим ідентифікатором не знайдено.'
				})
			}
			response.status(200).send(user)
		}
	} catch (exception) {
		next(exception)
	}
})

module.exports = loginRouter
