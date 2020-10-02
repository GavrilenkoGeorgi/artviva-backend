const inputValidation = require('../../utils/val_user_input')

describe('User input validation', () => {
	test('correctly validates password', () => {
		const { validateUserPass } = inputValidation
		const validPassword = 'ValidPassword1'
		const inValidPassword = 'InvalidPassword'

		expect(validateUserPass(validPassword)).toBe(true)
		expect(validateUserPass(inValidPassword)).toBe(false)
	})

	test('correctly validates email', () => {
		const { validateEmail } = inputValidation
		const validEmail = 'email@example.com'
		const invalidEmails = ['email@example.', 'email', '@example.', '@example', '.example', 'email@example.c']

		expect(validateEmail(validEmail)).toBe(true)
		for (const email of invalidEmails)
			expect(validateEmail(email)).toBe(false)
	})

	test('correctly validates UUIDv4', () => {
		const { validateUUIDv4 } = inputValidation
		const validUUIDv4 = '3bb441a5-a4cf-4f61-846f-6db78594b225'
		const invalidUUIDv4s = ['3bb441a5-a4cf-4f61-846f-6db78594b2251', '3bb441a5a4cf-4f61-846f-6db78594b225']

		expect(validateUUIDv4(validUUIDv4)).toBe(true)
		for (const uuid of invalidUUIDv4s)
			expect(validateUUIDv4(uuid)).toBe(false)
	})

	test('correctly validates user registration data', () => {
		const { validateUserRegData } = inputValidation
		const validUserRegData = {
			email: 'mail@example.com',
			name: 'Joe',
			middlename: 'Tester',
			lastname: 'Doe',
			password: 'TestPassword1'
		}

		const invalidUserRegData = [
			{ ...validUserRegData, email: 'invalid@email' },
			{ ...validUserRegData, name: '' },
			{ ...validUserRegData, password: '1234567890' },
		]

		expect(validateUserRegData(validUserRegData)).toBe(true)
		for (const user of invalidUserRegData)
			expect(validateUserRegData(user)).toBe(false)
	})
})
