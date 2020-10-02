const { passResetHashExpiry, sortMonthsNames } = require('../../utils/dateAndTime')

describe('Date and Time helper', () => {
	test('correctly sets password hash expiration date', () => {
		const hours = 3
		const now = new Date()
		const result = new Date(passResetHashExpiry(hours))

		expect(result.getHours()).toBeGreaterThanOrEqual(now.getHours() + hours)
	})

	test('correctly sorts school year months list in UA locale', () => {
		const sortedUaMonths = ['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень']
		const unsortedUaMonths = ['грудень', 'жовтень', 'січень', 'вересень', 'лютий', 'березень', 'червень', 'квітень', 'травень', 'липень', 'серпень', 'листопад']

		expect(sortMonthsNames(unsortedUaMonths, 'uk-UA')).toEqual(sortedUaMonths)
	})

	test('correctly sorts school year months list in RU locale', () => {
		const sortedRuMonths = ['сентябрь', 'октябрь', 'ноябрь', 'декабрь', 'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август']
		const unsortedRuMonths = ['декабрь', 'апрель', 'сентябрь', 'ноябрь', 'январь', 'февраль', 'март', 'июль', 'май', 'июнь', 'август', 'октябрь']

		expect(sortMonthsNames(unsortedRuMonths, 'ru-RU')).toEqual(sortedRuMonths)
	})
})
