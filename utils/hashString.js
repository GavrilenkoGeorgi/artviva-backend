const bcrypt = require('bcrypt')

const hashString = async string => {
	const saltRounds = 10
	return await bcrypt.hash(string, saltRounds)
}

module.exports = { hashString }
