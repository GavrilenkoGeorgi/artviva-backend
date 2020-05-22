/**
 * Get payment data object from payment description string
 * from liqpay
 * Description string goes like this:
 * `Оплата: лютий, березень, квітень.
 * Викладач: Hank Hill.
 * Учень: Bobby Hill.
 * Предмет: Саксофон.`
 * @param {string} descrStr - Payment description
 *
 * @returns {object} - Payment data object
 */

const getPaymentDataFromString = descrStr => {

	// initial payment data
	let paymentData = {
		teacher: '',
		pupil: '',
		specialty: '',
		months: []
	}

	const getDataIdx = string => {
		const start = string.indexOf(':')
		const end = string.indexOf('.')
		return { start, end }
	}

	const extractString = (str, start, end ) => {
		return str.slice(start + 1, end).trim()
	}

	// substring with months data into array
	const monthsIdx = getDataIdx(descrStr)
	const months = extractString(descrStr, monthsIdx.start, monthsIdx.end)
	paymentData.months = months.split(',').map(item => item.trim())

	// get teacher name
	let remainingData = descrStr.substr(monthsIdx.end + 1).trim()
	const teacherIdx = getDataIdx(remainingData)
	paymentData.teacher = extractString(remainingData, teacherIdx.start, teacherIdx.end)

	// get pupil name
	remainingData = remainingData.substr(teacherIdx.end + 1).trim()
	const pupilIdx = getDataIdx(remainingData)
	paymentData.pupil = extractString(remainingData, pupilIdx.start, pupilIdx.end)

	// get specialty title
	remainingData = remainingData.substr(pupilIdx.end + 1).trim()
	const specialtyIdx = getDataIdx(remainingData)
	paymentData.specialty = extractString(remainingData, specialtyIdx.start, specialtyIdx.end)

	return paymentData
}

module.exports = {
	getPaymentDataFromString
}