/**
* Set pass reset hash expiration date
*
* @param {integer} hours - Number of hours to add
* @return - date plus given number of hours
*/

const passResetHashExpiry = hours => {
	const date = new Date()
	return date.setHours(date.getHours() + hours)
}

/**
 * Sort list of months in given locale
 *
 * @param {string} - Locale string
 * @param {Array} - List of months to sort
 *
 * @return {Array} - Array of months
 */

const sortMonthsNames = (data, locale) => {
	// generate array of months for current locale
	/*
	const getMonths = () => {
		let date = new Date()
		const result = []
		try {
			[...Array(12).keys()].map(month => {
				date.setMonth(month)
				result.push(date.toLocaleString('uk-UA', { month:'long' }))
			})
		} catch (error) {
			console.error(error)
		}
		return result
	}
	const listOfAllMonths = getMonths(locale)
	*/

	// https://github.com/nodejs/node/issues/8500
	// hence this two arrays with months names
	// const uaMonths = ['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень']
	// const ruMonths = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
	const uaMonths = ['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень']
	const ruMonths = ['сентябрь', 'октябрь', 'ноябрь', 'декабрь', 'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август']

	let listOfAllMonths

	switch (locale) {
	case 'uk-UA':
		listOfAllMonths = uaMonths
		break
	case 'ru-RU':
		listOfAllMonths = ruMonths
		break
	default: // default to ua
		listOfAllMonths = uaMonths
	}
	return data.sort((a, b) => listOfAllMonths.indexOf(a) - listOfAllMonths.indexOf(b))
}

module.exports = { passResetHashExpiry, sortMonthsNames }
