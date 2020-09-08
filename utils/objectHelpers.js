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

/**
* Check if object is empty
* @param {Object} obj - Object to check
*
* @returns {boolean} - True if object exists, false otherwise
*/
const pureObjectIsEmpty = obj => obj && obj.constructor === Object && Object.keys(obj).length === 0

module.exports = {
	checkAllPropsArePresent,
	pureObjectIsEmpty
}
