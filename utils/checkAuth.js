const { getTokenFromReq } = require('./getTokenFromReq')
const jwt = require('jsonwebtoken')

const checkAuth = request => {
	const token = getTokenFromReq(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	return (!token || !decodedToken.id) ? false : true
}

module.exports = {
	checkAuth
}
