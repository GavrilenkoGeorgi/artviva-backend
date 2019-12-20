const checkNameAndPass = (email, name, pass) => {
	const validEmailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	const validNamePattern = /^[^0-9]{3,45}$/
	const validPassPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/

	const validEmail = email.match(validEmailPattern)
	const validName = name.match(validNamePattern)
	const validPass = pass.match(validPassPattern)

	return (validEmail && validName && validPass ? true : false)
}

module.exports = {
	checkNameAndPass
}
