const Specialty = require('../models/specialty')
const User = require('../models/user')


const initialSpecialties = [
	{
		title: 'Basic programming language',
		cost: 300,
		info: ''
	},
	{
		title: 'Java',
		cost: 350,
		info: 'Some info'
	}
]

const nonExistingSpecId = async () => {
	const specialty = new Specialty({ title: 'willremovethissoon', cost: 1, info: '' })
	await specialty.save()
	await specialty.remove()

	return specialty._id.toString()
}

const specialtiesInDb = async () => {
	const specialties = await Specialty.find({})
	return specialties.map(spec => spec.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = {
	usersInDb,
	initialSpecialties,
	specialtiesInDb,
	nonExistingSpecId
}
