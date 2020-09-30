const { filterIds } = require('../../utils/arrayHelpers')

describe('IDs filter', () => {
	test('correctly filters IDs in given arrays', () => {
		const unchangedId = '5f326ee1cdb8f61acc156d56'
		const idsToRemove = [unchangedId, '5f326f4ccdb8f61acc156d57']
		const idsToAdd = [unchangedId, '5f3cf95ddbb60902b4eeb242', '5f314c7ea8a18f11bc2f97a3']

		const result = filterIds([ ...idsToRemove ], [ ...idsToAdd ])

		expect(result.idsToRemove.includes(unchangedId)).toBe(false)
		expect(result.idsToRemove.length).toBe(idsToRemove.length - 1)

		expect(result.idsToAdd.includes(unchangedId)).toBe(false)
		expect(result.idsToAdd.length).toBe(idsToAdd.length - 1)
	})

	test('no duplicate IDs are being added', () => {
		const currentIds = ['5f3cf95ddbb60902b4eeb242', '5f314c7ea8a18f11bc2f97a3', '5f326f4ccdb8f61acc156d57']
		const idsToAdd = ['5f326ee1cdb8f61acc156d56', '5f3cf95ddbb60902b4eeb242', '5f314c7ea8a18f11bc2f97a3', '5f326f4ccdb8f61acc156d57']

		const result = filterIds([ ...currentIds ], [ ...idsToAdd ])

		expect(result.idsToRemove.length).toBe(0)
		expect(result.idsToAdd.length).toBe(idsToAdd.length - currentIds.length)
	})

	test('when nothing changed, we get empty arrays', () => {
		const currentIds = ['5f3cf95ddbb60902b4eeb242', '5f314c7ea8a18f11bc2f97a3', '5f326f4ccdb8f61acc156d57']
		const idsToAdd = ['5f3cf95ddbb60902b4eeb242', '5f314c7ea8a18f11bc2f97a3', '5f326f4ccdb8f61acc156d57']

		const result = filterIds([ ...currentIds ], [ ...idsToAdd ])

		expect(result.idsToRemove.length).toBe(0)
		expect(result.idsToAdd.length).toBe(0)
	})
})
