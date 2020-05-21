const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const paymentDescrSchema = mongoose.Schema({
	teacher: {
		type: String,
		maxlength: 128,
		required: true
	},
	pupil: {
		type: String,
		maxlength: 128
	},
	specialty: {
		type: String,
		maxlength: 128
	},
	months: [
		String
	]
})

paymentDescrSchema.plugin(uniqueValidator)

paymentDescrSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const PaymentDescr = mongoose.model('PaymentDescr', paymentDescrSchema)

module.exports = PaymentDescr
