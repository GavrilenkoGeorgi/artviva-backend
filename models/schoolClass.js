const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schoolClassSchema = mongoose.Schema({
	title: {
		type: String,
		unique: true,
		minlength: 3,
		maxlength: 128,
		required: true
	},
	info: {
		type: String,
		minlength: 3,
		maxlength: 255
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Teacher'
	},
	specialty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Specialty'
	},
	pupils: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pupil'
		}
	]
})

schoolClassSchema.plugin(uniqueValidator)

schoolClassSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const SchoolClass = mongoose.model('SchoolClass', schoolClassSchema)

module.exports = SchoolClass
