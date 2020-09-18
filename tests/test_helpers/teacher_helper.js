
const Teacher = require('../../models/teacher')

const sampleTeacherData = [
	{
		experienceToDate: { 'years': 1, 'months': 1, 'days': 1 },
		isAdministration: true,
		isRetired: false,
		employeeIsAStudent: false,
		accomplishmentsDscr: '',
		info: 'Some info',
		schoolClasses: [],
		specialties: [],
		payments: [],
		branches: [],
		name: 'Mary Tester Doe',
		dateOfBirth: '1988-07-13',
		employmentDate: '2000-01-01',
		weekWorkHours: 10,
		phone: '+38(050)555-55-55',
		contactEmail: 'email@example.com',
		residence: 'Село',
		gender: 'Жіноча',
		maritalStatus: 'одружений',
		university: 'Stanford',
		educationType: 'Базова віща освіта',
		educationDegree: 'Бакалавр',
		qualification: 'Немає',
		teacherTitle: 'Викладач-методист',
		scienceDegree: 'Немає',
		category: 9,
		employeeType: 'Штатний співробітник'
	},
	{
		experienceToDate: { 'years': 0, 'months': 0, 'days': 0 },
		isAdministration: true,
		isRetired: false,
		employeeIsAStudent: false,
		accomplishmentsDscr: '',
		info: 'Some info',
		schoolClasses: [],
		specialties: [],
		payments: [],
		branches: [],
		name: 'John Tester Doe',
		dateOfBirth: '1988-07-13',
		employmentDate: '2000-01-01',
		weekWorkHours: 10,
		phone: '+38(050)555-55-55',
		contactEmail: 'john@example.com',
		residence: 'Село',
		gender: 'Чоловіча',
		maritalStatus: 'одружений',
		university: 'Stanford',
		educationType: 'Базова віща освіта',
		educationDegree: 'Бакалавр',
		qualification: 'Немає',
		teacherTitle: 'Викладач-методист',
		scienceDegree: 'Немає',
		category: 9,
		employeeType: 'Штатний співробітник'
	}
]

const nonExistingTeacherId = async () => {
	const teacher = new Teacher({ ...sampleTeacherData[0], name: 'Invalid ID' })
	await teacher.save()
	await teacher.remove()

	return teacher._id.toString()
}

const teachersInDb = async () => {
	const teachers = await Teacher.find({})
	return teachers.map(teacher => teacher.toJSON())
}

module.exports = {
	nonExistingTeacherId,
	teachersInDb,
	sampleTeacherData
}
