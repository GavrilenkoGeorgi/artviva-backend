/**
 * Check if all required properties are present in a non nested object
 * @param {Object} obj - Object to check
 * @param {Array} propsList - List of required properies
 *
 * @return {Boolean} - True if ok, else throws an error with a list of missing props
 */

const checkAllPropsArePresent = (obj, propsList) => {
	const missingProps = propsList.filter(prop => !(prop in obj))
	if (missingProps.length === 0 || missingProps.length === propsList.length) {
		return true
	} else {
		throw ({
			name: 'ObjectPropsCheck',
			message: `Відсутні деякі поля: ${missingProps.join(', ')}`
		})
	}
}

module.exports = {
	checkAllPropsArePresent
}
