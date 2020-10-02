/**
 * Filter two array of strings and get the difference
 * It removes duplicate (if any) IDs from two arrays,
 * those that are returned are the ones to add or remove
 * from respective entities that are being updated
 *
 * @param {array} idsToRemove - Array of strings with IDs to remove
 * @param {array} idsToAdd - Array of strings with IDs to add
 *
 * @return {object} idsToRemove: IDs from which entity id needs to be removed,
 * 									idsToadd: IDs to add to an entity being updated
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
