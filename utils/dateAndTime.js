/**
* Set pass reset hash expiration date
*
* @param integer hours Number of hours to add
* @return date plus given number of hours
*/

const passResetHashExpiry = hours => {
	const date = new Date()
	return date.setHours(date.getHours() + hours)
}

module.exports = { passResetHashExpiry }
