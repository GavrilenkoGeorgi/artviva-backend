const paymentRouter = require('express').Router()
const Payment = require('../models/payment')
const LiqPay = require('../utils/liqpay')
const Base64 = require('js-base64').Base64

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

module.exports = paymentRouter
