const validEmailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const validUUIDv4Pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
const validPassPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
const validNamePattern = /^[^0-9]{3,45}$/

// check user reg creds
const validateUserRegData = ({ email, name, middlename, lastname, password }) => {
	const validEmail = email.match(validEmailPattern)
	const validName = name.match(validNamePattern)
	const validMiddlename = middlename.match(validNamePattern)
	const validLastname = lastname.match(validNamePattern)
	const validPass = password.match(validPassPattern)

	return (validEmail && validName && validMiddlename && validLastname && validPass ? true : false)
}

const validateTeacherData = (name, middlename, lastname) => {
	const validName = name.match(validNamePattern)
	const validMiddlename = middlename.match(validNamePattern)
	const validLastname = lastname.match(validNamePattern)

	return (validName && validMiddlename && validLastname ? true : false)
}

const validateEmail = email => {
	const validEmail = email.match(validEmailPattern)
	return validEmail ? true : false
}

const validateUUIDv4 = UUID => {
	const validUUID = UUID.match(validUUIDv4Pattern)
	return validUUID ? true : false
}

const validateUserPass = password => {
	const validPassword = password.match(validPassPattern)
	return validPassword ? true : false
}

module.exports = {
	validateUserRegData,
	validateEmail,
	validateUUIDv4,
	validateUserPass
}
