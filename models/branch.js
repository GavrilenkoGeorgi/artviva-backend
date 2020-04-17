const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const branchSchema = mongoose.Schema({
	name: {
		type: String,
		unique: true,
		minlength: 3,
		maxlength: 128,
		required: true
	},
	town: {
		type: String,
		minlength: 3,
		maxlength: 128
	},
	address: {
		type: String,
		minlength: 3,
		maxlength: 128
	},
	phone: {
		type: String,
		minlength: 3,
		maxlength: 19
	},
	info: {
		type: String,
		minlength: 3,
		maxlength: 255
	},
	latitude: {
		type: Number
	},
	longitude: {
		type: Number
	},
	image: {
		type: String,
		maxlength: 255
	},
	teachers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Teacher'
		}
	],
	pupils: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pupil'
		}
	]
})

branchSchema.plugin(uniqueValidator)

branchSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Branch = mongoose.model('Branch', branchSchema)

module.exports = Branch
