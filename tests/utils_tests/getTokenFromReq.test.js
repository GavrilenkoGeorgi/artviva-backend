const { getTokenFromReq } = require('../../utils/getTokenFromReq')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJlbWFpbCI6ImdhdnJpbGVua28uZ2VvcmdpQGdtYWlsLmNvbSIsImlkIjoiNWU4MWVjZTMzZjVhZGMxMDkwOWJkOWZkIiwiaWF0IjoxNTg2OTU3NzAxfQ.7BUGKKtERSmzwzvTsCgpLbGsVPJmu1u2IQhntG1KKOI'

const request = {
	get: data => {
		switch (data) {
		case 'authorization':
			return `Bearer ${token}`
		default:
			return false
		}
	}
}

const requestWithoutAuth = {
	get: () => false
}

describe('Token extractor', () => {
	test('correctly extracts auth token from string', () => {
		expect(getTokenFromReq(request)).toBe(token)
	})

	test('returns null if auth header is missing', () => {
		expect(getTokenFromReq(requestWithoutAuth)).toBe(null)
	})
})