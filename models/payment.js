const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const paymentSchema = mongoose.Schema({
	payment_id: {
		type: String,
		unique: true
	},
	action: {
		type: String,
		max: 16
	},
	status: {
		type: String,
		max: 16
	},
	version: {
		type: Number,
		max: 99
	},
	type: {
		type: String,
		max: 16
	},
	paytype: {
		type: String,
		max: 16
	},
	public_key: {
		type: String,
		min: 12,
		max: 20
	},
	acq_id: {
		type: Number,
		max: 9999999
	},
	order_id: {
		type: String,
		max: 36
	},
	liqpay_order_id: {
		type: String,
		max: 24
	},
	description: {
		type: String,
		max: 254
	},
	sender_card_mask2: {
		type: String,
		max: 9
	},
	sender_card_bank: {
		type: String,
		max: 16
	},
	sender_card_type: {
		type: String,
		max: 16
	},
	sender_card_country: {
		type: Number,
		max: 9999
	},
	ip: {
		type: String,
		max: 15
	},
	amount: {
		type: Number,
		max: 1000000
	},
	currency: {
		type: String,
		max: 3
	},
	sender_commission: {
		type: Number,
		max: 1000000
	},
	receiver_commission: {
		type: Number,
		max: 1000000
	},
	agent_commission: {
		type: Number,
		max: 1000000
	},
	amount_debit: {
		type: Number,
		max: 1000000
	},
	amount_credit: {
		type: Number,
		max: 1000000
	},
	commission_debit: {
		type: Number,
		max: 1000000
	},
	commission_credit: {
		type: Number,
		max: 1000000
	},
	currency_debit: {
		type: String,
		max: 3
	},
	currency_credit: {
		type: String,
		max: 3
	},
	sender_bonus: {
		type: Number,
		max: 1000000
	},
	amount_bonus: {
		type: Number,
		max: 1000000
	},
	mpi_eci: {
		type: Number
	},
	is_3Ds: {
		type: Boolean
	},
	language: {
		type: String,
		max: 3
	},
	create_date: {
		type: Number
	},
	end_date: {
		type: Number
	},
	transaction_id: {
		type: Number,
		max: 9999999999
	}
})

paymentSchema.plugin(uniqueValidator)

paymentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
