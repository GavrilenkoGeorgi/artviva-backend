
const Pupil = require('../../models/pupil')

const validSampleId = '5f08454d6f4f2d000468a069'

const updatedPupil = {
	assignedTo: null,
	name: 'Updated Test Pupil',
	phoneNumber: '+38 (050) 555-55-55',
	applicantName: 'John Doe',
	specialty: 'Basic programming language',
	dateOfBirth: '2020-08-01',
	mainSchool: 'Some school #34',
	mainSchoolClass: 3,
	artSchoolClass: 1,
	gender: 'Чоловіча',
	hasBenefit: 50,
	fathersName: 'Hank Hill',
	fathersPhone: '+38 (050) 888-44-77',
	fathersEmploymentInfo: 'Assistant manager at Strickland propane',
	mothersName: 'Peggy Hill',
	mothersPhone: '+38 (050) 555-44-33',
	mothersEmploymentInfo: 'Substitute spanish teacher',
	contactEmail: 'email@example.com',
	homeAddress: 'Street, 13, flat #56',
	docsPresent: false,
	info: 'Updated test pupil data'
}

const pupilWithAClass = {
	assignedTo: null,
	name: 'Test Pupil to delete',
	phoneNumber: '+38 (050) 555-55-55',
	applicantName: 'John Doe',
	specialty: validSampleId,
	dateOfBirth: '2020-08-01',
	mainSchool: 'Some school #34',
	mainSchoolClass: 3,
	artSchoolClass: 1,
	gender: 'Чоловіча',
	hasBenefit: 50,
	fathersName: 'Hank Hill',
	fathersPhone: '+38 (050) 888-44-77',
	fathersEmploymentInfo: 'Assistant manager at Strickland propane',
	mothersName: 'Peggy Hill',
	mothersPhone: '+38 (050) 555-44-33',
	mothersEmploymentInfo: 'Substitute spanish teacher',
	contactEmail: 'email@example.com',
	homeAddress: 'Street, 13, flat #56',
	docsPresent: false,
	info: '',
	schoolClasses: [validSampleId]
}

const samplePupilData = [
	{
		assignedTo: null,
		name: 'First Test Pupil',
		phoneNumber: '+38 (050) 555-55-55',
		applicantName: 'John Doe',
		specialty: '',
		dateOfBirth: '2010-08-01',
		mainSchool: 'Some school #34',
		mainSchoolClass: 1,
		artSchoolClass: 1,
		gender: 'Чоловіча',
		hasBenefit: 100,
		fathersName: 'Hank Hill',
		fathersPhone: '+38 (050) 888-44-77',
		fathersEmploymentInfo: 'Assistant manager at Strickland propane',
		mothersName: 'Peggy Hill',
		mothersPhone: '+38 (050) 555-44-33',
		mothersEmploymentInfo: 'Substitute spanish teacher',
		contactEmail: 'email@example.com',
		homeAddress: 'Street, 13, flat #56',
		docsPresent: true,
		currentlyEnrolled: true,
		graduated: false,
		suspended: true,
		info: 'Docs present, currently enrolled, suspended and not graduated yet.'
	},
	{
		assignedTo: null,
		name: 'Second Test Pupil',
		phoneNumber: '+38 (050) 555-55-55',
		applicantName: 'John Doe',
		specialty: '',
		dateOfBirth: '2015-08-01',
		mainSchool: 'Some school #34',
		mainSchoolClass: 2,
		artSchoolClass: 2,
		gender: 'Жіноча',
		hasBenefit: 50,
		fathersName: 'Hank Hill',
		fathersPhone: '+38 (050) 888-44-77',
		fathersEmploymentInfo: 'Assistant manager at Strickland propane',
		mothersName: 'Peggy Hill',
		mothersPhone: '+38 (050) 555-44-33',
		mothersEmploymentInfo: 'Substitute spanish teacher',
		contactEmail: 'email@example.com',
		homeAddress: 'Street, 13, flat #56',
		docsPresent: false,
		currentlyEnrolled: false,
		graduated: true,
		suspended: false,
		info: 'School graduate.'
	}
]

const nonExistingPupilId = async () => {
	const pupil = new Pupil({ ...samplePupilData[0], name: 'Invalid ID', specialty: validSampleId })
	await pupil.save()
	await pupil.remove()

	return pupil._id.toString()
}

const pupilsInDb = async () => {
	const pupils = await Pupil.find({})
	return pupils.map(pupil => pupil.toJSON())
}

module.exports = {
	nonExistingPupilId,
	pupilsInDb,
	samplePupilData,
	updatedPupil,
	pupilWithAClass
}
