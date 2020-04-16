const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const specialtySchema = mongoose.Schema({
	name: {
		type: String,
		unique: true,
		min: 3,
		max: 128,
		required: true
	},
	cost: {
		type: Number,
		required: true
	},
	info: {
		type: String,
		min: 3,
		max: 255
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
