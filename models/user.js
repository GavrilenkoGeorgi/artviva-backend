const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
		max: 45
	},
	name: {
		type: String,
		min: 3,
		max: 45
	},
	middlename: {
		type: String,
		min: 3,
		max: 45
	},
	lastname: {
		type: String,
		min: 3,
		max: 45
	},
	isActive: {
		type: Boolean,
		default: false
	},
	passwordHash: String,
	activationUUID: String,
	passResetHash: String,
	passResetHashExpiresAt: Date,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User
