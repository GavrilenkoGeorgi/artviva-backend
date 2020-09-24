const SchoolClass = require('../../models/schoolClass')

const sampleSchoolClasses = [
	{
		title: 'First Test Class',
		info: 'Тестовий клас',
		teacher: 'Mary Tester Doe',
		specialty: 'Basic programming language',
		pupils: ['First Test Pupil']
	},
	{
		title: 'Second Test Class',
		info: '',
		teacher: 'John Tester Doe',
		specialty: 'Java',
		pupils: ['First Test Pupil', 'Second Test Pupil']
	}
]

const updatedClass = {
	title: 'Updated Test Class',
	info: '',
	teacher: 'John Tester Doe',
	specialty: 'Java',
	pupils: ['First Test Pupil', 'Second Test Pupil']
}

const classesInDb = async () => {
	const schoolClasses = await SchoolClass.find({})
	return schoolClasses.map(item => item.toJSON())
}

module.exports = {
	sampleSchoolClasses,
	classesInDb,
	updatedClass
}
