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
	},
	employmentDate: {
		type: Date,
	},
	experienceToDate: {
		years: { type: Number, default: 0 },
		months: { type: Number, default: 0 },
		days: { type: Number, default: 0 }
	},
	weekWorkHours: {
		type: Number,
		max: 100
	},
	phone: {
		type: String,
		minlength: 3,
		maxlength: 19,
	},
	contactEmail: {
		type: String,
		maxlength: 128
	},
	residence: {
		type: String,
		max: 64,
	},
	gender: {
		type: String,
		max: 16,
	},
	university: {
		type: String,
		max: 255,
	},
	educationType: {
		type: String,
		max: 128,
	},
	educationDegree: {
		type: String,
		max: 128,
	},
	qualification: {
		type: String,
		max: 64,
	},
	teacherTitle: {
		type: String,
		max: 64,
	},
	scienceDegree: {
		type: String,
		max: 64,
	},
	category: {
		type: Number,
		max: 17,
	},
	employeeType: {
		type: String,
		max: 64,
	},
	isAdministration: {
		type: Boolean,
		default: false
	},
	maritalStatus: {
		type: String,
		max: 32,
	},
	isRetired: {
		type: Boolean,
		default: false
	},
	employeeIsAStudent: {
		type: Boolean,
		default: false
	},
	accomplishmentsDscr: {
		type: String,
		maxlength: 2500,
		default: null
	},
	info: {
		type: String,
		maxlength: 255,
		default: null
	},
	linkedUserAccountId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
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
