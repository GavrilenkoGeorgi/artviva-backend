const { v4: uuidv4 } = require('uuid')
// const Payment = require('../../models/payment')

const singlePayment = {
	action: 'pay',
	amount: 250,
	currency: 'UAH',
	description: 'Оплата: лютий, березень, квітень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.',
	order_id: uuidv4(),
	version: '3',
	language: 'uk',
	result_url: '/api/testing/payment/result'
}

/*
const sampleUsers = [
	{
		email: 'tester@example.com',
		name: 'John',
		middlename: 'Tester',
		lastname: 'Doe',
		password: 'TestPassword3'
	},
	{
		email: 'mary@example.com',
		name: 'Mary',
		middlename: 'Tester',
		lastname: 'Doe',
		password: 'TestPassword4'
	}
]

const validNonExistingId = async () => {
	const user = new Payment({
		...newUser,
		email: 'temp@example.com',
		teacher: null
	})
	await user.save()
	await user.remove()

	return user._id.toString()
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}*/

module.exports = {
	// usersInDb,
	singlePayment,
	// sampleUsers,
	// validNonExistingId
}
