const User = require('../../models/user')

const newUser = {
	email: 'test@example.com',
	name: 'Jack',
	middlename: 'Tester',
	lastname: 'Doe',
	password: 'TestPassword2',
	teacher: ''
}

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
	const user = new User({
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
}

module.exports = {
	usersInDb,
	newUser,
	sampleUsers,
	validNonExistingId
}
