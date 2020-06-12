/**
 * Filter two array of strings and get the difference
 * @param {array} idsToRemove - Array of strings with ids to remove
 * @param {array} idsToAdd - Array of strings with ids to add
 *
 * @return {object} idsToRemove: ids from which entity needs to be removed,
 * 									idsToadd: ids to add entity to
 */

const filterIds = (idsToRemove, idsToAdd) => {
	idsToAdd = idsToAdd.filter(item => !idsToRemove.includes(item)
		? true
		: idsToRemove.splice(idsToRemove.indexOf(item), 1) && false)
	return { idsToRemove, idsToAdd }
}

module.exports = {
	filterIds
}
