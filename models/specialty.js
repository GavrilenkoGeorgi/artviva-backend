const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const specialtySchema = mongoose.Schema({
	title: {
		type: String,
		unique: true,
		minlength: 3,
		maxlength: 128,
		required: true
	},
	cost: {
		type: Number,
		required: true,
		max: 9999
	},
	info: {
		type: String,
		maxlength: 255
	},
	teachers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Teacher'
		}
	],
	schoolClasses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SchoolClass'
		}
	]
})

specialtySchema.plugin(uniqueValidator)

specialtySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Specialty = mongoose.model('Specialty', specialtySchema)

module.exports = Specialty
