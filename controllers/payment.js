const paymentRouter = require('express').Router()
const Base64 = require('js-base64').Base64
const jwt = require('jsonwebtoken')

const Payment = require('../models/payment')
const Teacher = require('../models/teacher')
const LiqPay = require('../utils/liqpay')

const { getPaymentDataFromString } = require('../utils/processPaymentDescr')
const { getTokenFromReq } = require('../utils/getTokenFromReq')


const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY)

paymentRouter.post('/form', async (request, response, next) => {
	try {
		const { data, signature, language } = liqpay.cnb_form(request.body)
		return response
			.status(200)
			.send({
				data,
				signature,
				language
			})
	} catch (exception) {
		next(exception)
	}
})

paymentRouter.post('/result', async (request, response, next) => {
	try {
		const { data, signature } = { ...request.body }
		const validSignature = liqpay.str_to_sign(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
		if (signature === validSignature) {
			const paymentData = JSON.parse(Base64.decode(data))

			if (paymentData.err_code === 'cancel') {
				return response
					.redirect(303, `${process.env.PAYMENT_RESULT_URL}/form`)
			}

			if (paymentData.status === 'success') {
				const { payment_id, status } = { ...paymentData }
				const existingPayment = await Payment.findOne({ payment_id })

				if (!existingPayment) { // save payment
					const payment = new Payment({ ...paymentData })
					const savedPayment = await payment.save()
					const paymentDescr = getPaymentDataFromString(payment.description)

					// if teacher name is correct, add payment
					// to the teacher's list of payments
					const teacher = await Teacher.findOneAndUpdate({ name: paymentDescr.teacher },
						{ $push: { payments: savedPayment._id } })
					if (teacher) {
						// if teacher has email in his account
						console.log('Sending message to the teacher email.', savedPayment._id)
					} else {
						// notify the supervisor
						console.log('Sending message to the supervisor, with payment details.', savedPayment._id)
					}

					if (savedPayment) return response.status(204).send()
				} else { // redirect to result page
					return response
						.redirect(303, `${process.env.PAYMENT_RESULT_URL}/${status}`)
				}
			}
		}
	} catch (exception) {
		next(exception)
	}
})

paymentRouter.post('/list', async (request, response, next) => {
	try {
		// check authentification
		const token = getTokenFromReq(request)
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const fields = 'description amount create_date status amount'
		const payments = await Payment.find({}, fields)
		response.status(200).send(payments.map(payment => payment.toJSON()))

	} catch (exception) {
		next(exception)
	}
})

paymentRouter.post('/:id', async (request, response, next) => {
	try {
		// check authentification
		const token = getTokenFromReq(request)
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Неаутентифіковані. Маркер відсутній або недійсний.'
			})
		}

		const fields = 'description amount create_date status'
		const payment = await Payment.findById(request.params.id, fields)
		response.status(200).json(payment.toJSON())

	} catch (exception) {
		next(exception)
	}
})

module.exports = paymentRouter
