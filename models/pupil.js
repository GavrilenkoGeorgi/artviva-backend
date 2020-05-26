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
	applicantName: {
		type: String,
		minlength: 2,
		maxlength: 128,
		required: true
	},
	specialty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Specialty'
	},
	dateOfBirth: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	mainSchool: {
		type: String,
		minlength: 2,
		maxlength: 128,
		required: true
	},
	mainSchoolClass: {
		type: Number,
		min: 1,
		max: 11,
	},
	gender: {
		type: String,
		max: 16,
	},
	hasBenefit: {
		type: Number,
		max: 100,
		default: 0
	},
	fathersName: {
		type: String,
		minlength: 2,
		maxlength: 128,
	},
	mothersName: {
		type: String,
		minlength: 2,
		maxlength: 128,
	},
	contactEmail: {
		type: String,
		maxlength: 128,
	},
	homeAddress: {
		type: String,
		maxlength: 255
	},
	docsPresent: {
		type: Boolean,
		default: false
	},
	info: {
		type: String,
		maxlength: 255
	},
	schoolClasses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SchoolClass'
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
