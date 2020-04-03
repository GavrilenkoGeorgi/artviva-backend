const mongoose = require('mongoose')

const paymentResultSchema = mongoose.Schema({
	result: {
		type: String,
		max: 16
	},
	payment_id: {
		type: Number,
		max: 9999999999
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
		max: 24
	},
	liqpay_order_id: {
		type: String,
		max: 24
	},
	description: {
		type: String,
		max: 128
	},
	sender_phone: {
		type: String,
		max: 12
	},
	sender_first_name: {
		type: String,
		max: 45
	},
	sender_last_name: {
		type: String,
		max: 45
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
	create_date: {
		type: Number
	},
	end_date: {
		type: Number
	},
	transaction_id: {
		type: Number,
		max: 9999999999
	},
	payment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Payment'
	}
})

paymentResultSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const PaymentResult = mongoose.model('PaymentResult', paymentResultSchema)

module.exports = PaymentResult
