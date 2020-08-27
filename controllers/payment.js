const paymentRouter = require('express').Router()
const Base64 = require('js-base64').Base64

const Payment = require('../models/payment')
const Teacher = require('../models/teacher')
const PaymentDescr = require('../models/paymentDescr')
const LiqPay = require('../utils/liqpay')

const { getPaymentDataFromString } = require('../utils/processPaymentDescr')
const { checkAuth } = require('../utils/checkAuth')

const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY)

// create new payment form data
paymentRouter.post('/form', async (request, response, next) => {
	try {
		const { data, signature, language } = liqpay.cnb_form(request.body)
		return response.status(200).send({
			data,
			signature,
			language
		})
	} catch (exception) {
		next(exception)
	}
})

// save payment result that comes from liqpay server
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

				if (!existingPayment) { // process payment
					const payment = new Payment({ ...paymentData })
					// parse descr string into object
					const parsedDescr = getPaymentDataFromString(payment.description, 'uk-UA')

					// create new payment description
					const paymentDescr = new PaymentDescr({ ...parsedDescr })
					paymentDescr.save()

					// add parsed payment descr to the saved payment
					payment.paymentDescr = paymentDescr._id

					// save payment
					const savedPayment = await payment.save()

					// if teacher name is correct, add payment
					// to the teacher's list of payments
					const teacher = await Teacher.findOneAndUpdate({ name: paymentDescr.teacher },
						{ $push: { payments: savedPayment._id } })
					if (teacher) {
						// if teacher has email in his account
						console.log('Sending message to the teacher email.', savedPayment._id)
					} else {
						// notify the supervisor
						console.log('Sending message to the supervisor with payment details.', savedPayment._id)
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

// list all payments
paymentRouter.get('/list', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const fields = 'description amount create_date status'
			const payments = await Payment.find({}, fields)
				.populate({ path: 'paymentDescr', select: 'pupil teacher specialty months' })
			response.status(200).send(payments.map(payment => payment.toJSON()))
		}
	} catch (exception) {
		next(exception)
	}
})

// get all payment descriptions
paymentRouter.get('/descr', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const descriptions = await PaymentDescr.find({})
			response.status(200).json(descriptions.map(descr => descr.toJSON()))
		}
	} catch (exception) {
		next(exception)
	}
})

// Edit payment description pupil name
paymentRouter.patch('/descr/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const updatedDescr =
				await PaymentDescr.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })

			if (!updatedDescr)
				return response.status(404)
					.send({ error: 'Платежу із цим ідентифікатором не знайдено.' })

			response.status(200).send(updatedDescr.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// get single payment detail by given ID
paymentRouter.get('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			const fields = 'description amount create_date status'
			const payment = await Payment
				.findById(request.params.id, fields).populate('paymentDescr')

			if (!payment)
				return response.status(404)
					.send({ error: 'Платежу із цим ідентифікатором не знайдено.' })

			response.status(200).json(payment.toJSON())
		}
	} catch (exception) {
		next(exception)
	}
})

// delete payment
paymentRouter.delete('/:id', async (request, response, next) => {
	try {
		if (checkAuth(request)) {
			// find payment
			const payment = await Payment.findById(request.params.id).populate('paymentDescr')
			if (!payment)
				return response.status(404)
					.send({ error: 'Платежу із цим ідентифікатором не знайдено.' })

			// remove it from the teacher's list
			await Teacher.findOneAndUpdate({ name: payment.paymentDescr.teacher },
				{ $pull: { payments: payment.id } }, { new: true })

			// remove its description
			await PaymentDescr.findByIdAndDelete(payment.paymentDescr._id)

			// delete payment
			await Payment.findByIdAndDelete(payment.id)
			response.status(204).end()
		}
	} catch (exception) {
		next(exception)
	}
})


module.exports = paymentRouter
