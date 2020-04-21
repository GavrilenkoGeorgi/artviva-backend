const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
	name: {
		type: String,
		mixlength: 2,
		maxlength: 128,
		required: true
	},
	specialties: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Specialty'
		}
	],
	payments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Payment'
		}
	],
	pupils: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pupil'
		}
	],
	branches: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Branch'
		}
	]
})

teacherSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher