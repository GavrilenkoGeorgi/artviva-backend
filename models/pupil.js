const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const pupilSchema = mongoose.Schema({
	name: {
		type: String,
		minlength: 2,
		maxlength: 128,
		unique: true,
		required: true
	},
	info: {
		type: String,
		minlength: 2,
		maxlength: 255
	},
	teachers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Teacher'
		}
	],
	specialties: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Specialty'
		}
	]
})

pupilSchema.plugin(uniqueValidator)

pupilSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Pupil = mongoose.model('Pupil', pupilSchema)

module.exports = Pupil
