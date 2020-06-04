const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const teacherSchema = mongoose.Schema({
	name: {
		type: String,
		minlength: 2,
		maxlength: 128,
		required: true,
		unique: true
	},
	dateOfBirth: {
		type: Date,
		required: true
	},
	employmentDate: {
		type: Date,
		required: true
	},
	experienceToDate: {
		years: { type: Number, default: 0 },
		months: { type: Number, default: 0 },
		days: { type: Number, default: 0 }
	},
	phone: {
		type: String,
		minlength: 3,
		maxlength: 19,
		required: true
	},
	contactEmail: {
		type: String,
		maxlength: 128
		// required: true
		// unique: true
	},
	residence: {
		type: String,
		max: 64,
		required: true
	},
	gender: {
		type: String,
		max: 16,
		required: true
	},
	university: {
		type: String,
		max: 255,
		required: true
	},
	educationType: {
		type: String,
		max: 128,
		required: true
	},
	educationDegree: {
		type: String,
		max: 128,
		required: true
	},
	qualification: {
		type: String,
		max: 64,
		required: true
	},
	teacherTitle: {
		type: String,
		max: 64,
		default: null
	},
	scienceDegree: {
		type: String,
		max: 64,
		default: null
	},
	category: {
		type: Number,
		max: 17,
		required: true
	},
	employeeType: {
		type: String,
		max: 64,
		required: true
	},
	isAdministration: {
		type: Boolean,
		default: false
	},
	maritalStatus: {
		type: String,
		max: 32,
		required: true
	},
	isRetired: {
		type: Boolean,
		default: false
	},
	employeeIsAStudent: {
		type: Boolean,
		default: false
	},
	info: {
		type: String,
		maxlength: 255,
		default: null
	},
	schoolClasses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SchoolClass'
		}
	],
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
	branches: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Branch'
		}
	]
})

teacherSchema.plugin(uniqueValidator)

teacherSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher
