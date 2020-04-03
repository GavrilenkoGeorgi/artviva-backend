const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
	teacher: {
		type: String,
		max: 45
	},
	specialty: {
		type: String,
		min: 3,
		max: 45
	},
	isSuccessful: {
		type: Boolean,
		default: false
	},
	public_key: {
		type: String,
		min: 12,
		max: 20
	},
	version: {
		type: String,
		max: 2
	},
	action: {
		type: String,
		max: 16
	},
	amount: {
		type: String,
		max: 16
	},
	currency: {
		type: String,
		max: 3
	},
	description: {
		type: String,
		max: 128
	},
	paytypes: {
		type: String,
		max: 16
	},
	card: {
		type: String,
		max: 16
	},
	card_exp_month: {
		type: String,
		max: 2
	},
	card_exp_year: {
		type: String,
		max: 2
	},
	card_cvv: {
		type: String,
		max: 3
	},
	result: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PaymentResult'
	}
})

paymentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
