const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
		maxlength: 45
	},
	name: {
		type: String,
		minlength: 3,
		maxlength: 45
	},
	middlename: {
		type: String,
		minlength: 3,
		maxlength: 45
	},
	lastname: {
		type: String,
		minlength: 3,
		maxlength: 45
	},
	isActive: {
		type: Boolean,
		default: false
	},
	passwordHash: {
		type: String,
		unique: true,
		maxlength: 60
	},
	activationHash: {
		type: String,
		maxlength: 60
	},
	passResetHash: {
		type: String,
		maxlength: 60
	},
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
