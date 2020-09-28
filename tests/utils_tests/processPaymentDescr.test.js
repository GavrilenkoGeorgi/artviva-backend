const { getPaymentDataFromString } = require('../../utils/processPaymentDescr')

describe('Payment description parser', () => {
	test('correctly creates payment description object', () => {
		const description = 'Оплата: лютий, березень, квітень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.'
		const result = getPaymentDataFromString(description)

		// eslint-disable-next-line
		const [ firstMonth, secondMonth, thirdMonth ] = result.months

		expect(result.teacher).toContain('Hank Hill')
		expect(result.pupil).toContain('Bobby Hill')
		expect(firstMonth).toContain('лютий')
		expect(thirdMonth).toContain('квітень')
	})

	test('throws an error if description string is malformed', () => {
		const invalidDscr = ''

		const invalidDescriptions = [
			'лютий, березень, квітень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.',
			'Оплата: Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.',
			'Оплата: лютий, березень, квітень. Викладач: Учень: Bobby Hill. Предмет: ',
			'Оплата: лютий, березень, квітень. Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.',
			'Оплата: лютий, березень, квітень. Викладач: Hank Hill. Bobby Hill. Предмет: Саксофон.'
		]

		expect(() => getPaymentDataFromString(invalidDscr))
			.toThrowError('Не вдається проаналізувати опис платежу, відсутні деякі дані.')

		for (const description of invalidDescriptions)
			expect(() => getPaymentDataFromString(description))
				.toThrowError('Не вдається проаналізувати опис платежу, відсутні деякі дані.')
	})
})
