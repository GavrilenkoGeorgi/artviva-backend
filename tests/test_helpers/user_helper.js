const User = require('../../models/user')

const newUser = {
	email: 'test@example.com',
	name: 'Jack',
	middlename: 'Tester',
	lastname: 'Doe',
	password: 'TestPassword2',
	teacher: ''
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = {
	usersInDb,
	newUser
}
