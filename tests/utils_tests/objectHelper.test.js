const { pureObjectIsEmpty, checkAllPropsArePresent } = require('../../utils/objectHelpers')

describe('Object helper util', () => {
	test('determines that pure object is empty', () => {
		const emptyObject = {}
		const nonEmptyObject = { data: '' }

		expect(pureObjectIsEmpty(emptyObject)).toBe(true)
		expect(pureObjectIsEmpty(nonEmptyObject)).toBe(false)
	})

	test('checks that all props are present', () => {
		const listOfRequiredProps = [ 'data', 'info' ]
		const testObjectWithAllProps = { data: 'test', info: '' }
		const testObjectWithMissingProps = { data: 'test' }

		expect(checkAllPropsArePresent(testObjectWithAllProps, listOfRequiredProps))
			.toBe(true)

		expect(() => checkAllPropsArePresent(testObjectWithMissingProps, listOfRequiredProps))
			.toThrowError('Відсутні деякі поля: info')
	})
})