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
	currentlyEnrolled: {
		type: Boolean,
		default: false
	},
	graduated: {
		type: Boolean,
		default: false
	},
	suspended: {
		type: Boolean,
		default: false
	},
	applicantName: {
		type: String,
		minlength: 2,
		maxlength: 128,
	},
	artSchoolClass: {
		type: Number,
		min: 1,
		max: 8,
	},
	dateOfBirth: {
		type: Date
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	mainSchool: {
		type: String,
		minlength: 2,
		maxlength: 128,
	},
	mainSchoolClass: {
		type: String,
		min: 1,
		max: 16,
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
	fathersPhone: {
		type: String,
		minlength: 3,
		maxlength: 19
	},
	fathersEmploymentInfo: {
		type: String,
		minlength: 2,
		maxlength: 128,
	},
	mothersName: {
		type: String,
		minlength: 2,
		maxlength: 128,
	},
	mothersPhone: {
		type: String,
		minlength: 3,
		maxlength: 19
	},
	mothersEmploymentInfo: {
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
	phoneNumber: {
		type: String,
		maxlength: 19
	},
	docsPresent: {
		type: Boolean,
		default: false
	},
	info: {
		type: String,
		maxlength: 255
	},
	specialty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Specialty'
	},
	schoolClasses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SchoolClass'
		}
	],
	teachers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Teacher'
		}
	],
	assignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
},
{
	timestamps: true
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
