const { v4: uuidv4 } = require('uuid')
const Payment = require('../../models/payment')
const PaymentDescr = require('../../models/paymentDescr')
const { getPaymentDataFromString } = require('../../utils/processPaymentDescr')

const singlePayment = {
	action: 'pay',
	amount: 250,
	currency: 'UAH',
	description: 'Оплата: лютий, березень, квітень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.',
	order_id: uuidv4(),
	version: '3',
	language: 'uk',
	result_url: '/api/testing/payment/result'
}

const samplePayments = [
	{
		payment_id: '1411226302',
		action: 'pay',
		status: 'success',
		version: 3,
		type: 'buy',
		paytype: 'card',
		public_key: 'sandbox_i41231363208',
		acq_id: 414963,
		order_id: uuidv4(),
		liqpay_order_id: 'N2J46LJU1598958249197033',
		description: 'Оплата: лютий, березень, квітень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.',
		sender_card_mask2: '414943*56',
		sender_card_bank: 'pb',
		sender_card_type: 'visa',
		sender_card_country: 804,
		ip: '130.180.212.73',
		amount: 1,
		currency: 'UAH',
		sender_commission: 0,
		receiver_commission: 0.03,
		agent_commission: 0,
		amount_debit: 1,
		amount_credit: 1,
		commission_debit: 0,
		commission_credit: 0.03,
		currency_debit: 'UAH',
		currency_credit: 'UAH',
		sender_bonus: 0,
		amount_bonus: 0,
		mpi_eci: 7,
		language: 'uk',
		create_date: 1598958230770,
		end_date: 1598958251091,
		transaction_id: 1411226302,
		paymentDescr: ''
	},
	{
		payment_id: '1411226303',
		action: 'pay',
		status: 'success',
		version: 3,
		type: 'buy',
		paytype: 'card',
		public_key: 'sandbox_i41231363208',
		acq_id: 414963,
		order_id: uuidv4(),
		liqpay_order_id: 'N2J46LJU1598958249197033',
		description: 'Оплата: лютий, березень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Piano.',
		sender_card_mask2: '414943*56',
		sender_card_bank: 'pb',
		sender_card_type: 'visa',
		sender_card_country: 804,
		ip: '130.180.212.73',
		amount: 2,
		currency: 'UAH',
		sender_commission: 0,
		receiver_commission: 0.03,
		agent_commission: 0,
		amount_debit: 1,
		amount_credit: 1,
		commission_debit: 0,
		commission_credit: 0.03,
		currency_debit: 'UAH',
		currency_credit: 'UAH',
		sender_bonus: 0,
		amount_bonus: 0,
		mpi_eci: 7,
		language: 'uk',
		create_date: 1598958230770,
		end_date: 1598958251091,
		transaction_id: 1411226302,
		paymentDescr: ''
	}
]

const validNonExistingId = async () => {
	const [ payment ] = samplePayments
	const description =
		new PaymentDescr(getPaymentDataFromString(payment.description, 'uk-UA'))
	description.save()

	const tempPayment = new Payment({
		...payment,
		payment_id: '1411226309',
		paymentDescr: description.id
	})
	await tempPayment.save()
	await tempPayment.remove()

	return tempPayment._id.toString()
}

const paymentsInDb = async () => {
	const payments = await Payment.find({})
	return payments.map(payment => payment.toJSON())
}

module.exports = {
	paymentsInDb,
	singlePayment,
	samplePayments,
	validNonExistingId
}
