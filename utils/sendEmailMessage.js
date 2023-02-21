const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const mailerCreds = require('../utils/mailerCreds').mailerCreds

const nodemailerMailgun = nodemailer.createTransport(mg(mailerCreds))

/**
 * Send email message using nodemailer and MailGun
 *
 * @param {object} message - Message object.
 * @param {string} message.to - "To" field.
 * @param {string} message.from - "From" field.
 * @param {string} message.subject - "Subject" field.
 * @param {string} message.text - Text message contents.
 * @param {string} message.html - Html message contents.
 *
 * @returns {Promise} Promise object of the email sent
 */

const sendEmailMessage = message => {

	const emailMessage = new Promise ((resolve, reject) => {
		nodemailerMailgun.sendMail({
			from: message.from,
			to: message.to,
			subject: message.subject,
			text: message.textOutput,
			html: message.htmlOutput
		}, (error, info) => {
			if (error) reject({
				name: 'MailGunError',
				message: `Помілка MailGun. ${error.statusCode} ${error}`
			})
			else resolve({
				sent: true,
				message: info.message
			})
		})
	})

	return emailMessage
}

/**
 * Send email with account activation instructions
 *
 * @param {object} data - User activation data.
 * @param {string} data.name - User name.
 * @param {string} data.email - User email to send message to.
 * @param {string} data.activationUUID - Activation UUID of the user account.
 *
 * @returns {Object} - Status of the email
 */

const sendAccountActivationMessage = async data => {

	const { name, email, activationUUID } = data

	const subject = 'Активація облікового запису на сайті ArtViva'
	const htmlOutput = `
		<h1>Активація облікового запису на сайті ArtViva</h1>
		<ul>
			<li>
				Добрий день, ${name}.
			</li>
			<li>
				Щоб активувати свій обліковий запис, натисніть на посилання: https://artviva.school/activate/${email}/${activationUUID}
			</li>
			<li>
				Після активації облікового запису адміністратору сайту доведеться переглянути та затвердити ваш рахунок. Після цього ви зможете увійти на сайт і використовувати всі його функції. Ви отримаєте електронне повідомлення з результатами затвердження вашого облікового запису. Дякуємо за терпіння та розуміння.
			</li>
		</ul>`
	const textOutput = `Добрий день, ${name}. Щоб активувати свій обліковий запис, натисніть на посилання: https://artviva.school/activate/${email}/${activationUUID}`

	const message = {
		from: process.env.PROD_EMAIL,
		to: email,
		subject,
		htmlOutput,
		textOutput
	}

	return await sendEmailMessage(message)
}

/**
 * Send pass reset email message with link
 *
 * @param {string} data - User password reset data.
 * @param {string} data.name - User name.
 * @param {string} data.email - User email to send message to.
 * @param {string} data.passResetToken - Unique password reset token.
 *
 * @returns {Object} - Status of the email
 */

const sendPassResetMessage = async data => {

	const { name, email, passResetToken } = data

	const subject = 'Скидання пароля на сайті ArtViva'

	const htmlOutput = `
		<h1>Скидання пароля на сайті ArtViva</h1>
			<h3>
				Добрий день, ${name}.
			</h3>
			<p>
				Щоб <a href="https://artviva.school/reset/${email}/${passResetToken}">скинути пароль</a>, перейдіть за посиланням: https://artviva.school/reset/${email}/${passResetToken}
			</p>`

	const textOutput = `Добрий день, ${name}. Щоб скинути пароль, перейдіть за посиланням: https://artviva.school/reset/${email}/${passResetToken}`

	const message = {
		from: process.env.PROD_EMAIL,
		to: email,
		subject,
		htmlOutput,
		textOutput
	}

	return await sendEmailMessage(message)
}

/**
 * Send contact form email message to the designated artviva info email
 *
 * @param {щиоусе} data - Contact message data.
 * @param {string} data.name - User name.
 * @param {string} data.email - User email to send message to.
 * @param {string} data.message - Message to send.
 *
 * @returns {Object} - Status of the email
 */

const sendContactMessage = async data => {

	const { name, email, message: text } = data

	const subject = 'Повідомлення з сайту ArtViva'
	const htmlOutput = `
		<h1>Контактна форма сайту ArtViva</h1>
		<ul>
			<li>
				Від: ${name}
			</li>
			<li>
				Електронна пошта: ${email}
			</li>
			<li>
				Повідомлення: ${text}
			</li>
			<li>
				Відповісти ${name} <a href="mailto:${email}?subject=Питання%20про%20навчання">${email}</a>
			</>
		</ul>`
	const textOutput = `У вас є повідомлення від ${name}. Електронна пошта: ${email} Повідомлення: ${text}`

	const message = {
		from: email,
		to: [process.env.CONTACT_FORM_HANDLER_EMAIL, process.env.TEST_EMAIL],
		replyTo: email,
		subject,
		htmlOutput,
		textOutput
	}

	return await sendEmailMessage(message)
}

/**
 * Send an email with a message that a new pupil was added
 * through public pupil form
 *
 * @param {object} data - New pupil data.
 * @param {string} data.name - New pupil name.
 * @param {string} data.applicantName - Form appicant name.
 * @param {string} data.contactEmail - Form apppicant contact email.
 *
 * @returns {Object} - Status of the email
 */

const sendNewPupilMessage = async data => {

	const subject = 'Додано нового учня'
	const htmlOutput = `
		<div style="font-family: Verdana, Geneva, Tahoma, sans-serif; padding: 30px 40px; border-radius: 15px; background-color: #f5f5f5; width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;">
			<h1 style="margin-top: 0;">Додано нового учня</h1>
			<ul style="list-style: none; padding: 0; font-size: 125%;">
				<li style="margin: 15px 0px;">
					Фах: <strong>${data.specialty}</strong>
				</li>
				<li style="margin: 15px 0px;">
					Ім'я: <strong>${data.name}</strong>
				</li>
				<li style="margin: 15px 0px;">
					Дата народження: <strong>${data.dateOfBirth}</strong>
				</li>
				<li style="margin: 15px 0px;">
					Заяву подав: ${data.applicantName}
				</li>
				<li style="margin: 15px 0px;">
					Номер телефону матері: <strong>${data.mothersPhone}</strong>
				</li>
				<li style="margin: 15px 0px;">
					Номер телефону батька: ${data.fathersPhone}
				</li>
				<li style="margin: 15px 0px;">
					Електронна пошта: ${data.contactEmail}
				</li>
				<li style="margin: 15px 0px;">
					Домашня адреса: ${data.homeAddress}
				</li>
			</ul>
		</div>`
	const textOutput = `Додано нового учня: ${data.name}. Заяву подав: ${data.applicantName}. Електронна пошта: ${data.contactEmail}`

	const message = {
		from: process.env.PROD_EMAIL,
		to: [process.env.PUBLIC_APPLY_EMAIL, process.env.TEST_EMAIL],
		subject,
		htmlOutput,
		textOutput
	}

	return await sendEmailMessage(message)
}

/**
 * Send an email with a feedback message to the
 * user that filled public form informing that
 * a form has been accepted
 *
 * @param {object} data - New pupil data.
 * @param {string} data.name - New pupil name.
 * @param {string} data.applicantName - Form appicant name.
 * @param {string} data.contactEmail - Form apppicant contact email.
 *
 * @returns {Object} - Status of the email
 */

const sendPublicApplyFeedbackMessage = async data => {

	const subject = 'Заява на навчання. ArtViva.'
	const htmlOutput = `
	<h1>Добрий день, ${data.applicantName}!</h1>
	<p>Ваша заявка була прийнята, зачекайте, з вами зв’яжемся.</p>
	<p style="color: gray;">
		Будь ласка, звертайтесь із усіма запитаннями до <a href="mailto:info@artviva.school?subject=Питання%20про%20навчання">info@artviva.school</a>
	</p>`

	const textOutput = `Добрий день, ${data.applicantName}! Ваша заявка була прийнята, зачекайте, поки ми з вами зв’яжемся.
		Будь ласка, звертайтесь із усіма запитаннями на цю електронну адресу info@artviva.school`

	const message = {
		from: process.env.PROD_EMAIL,
		to: data.contactEmail,
		subject,
		htmlOutput,
		textOutput
	}

	return await sendEmailMessage(message)
}

/**
 * Send test email
 *
 * @param {object} data - Test email data
 * @param {string} data.to - "To" email.
 * @param {string} data.text - Message to send.
 *
 * @returns {Object} - Status of the email
 */

const sendTestMessage = async data => {

	const { to, text } = data
	const subject = 'MailGun test email.'
	const htmlOutput = `
	<h1>Test email.</h1>
	<p>
		${text}
	</p>`
	const textOutput = `Test email. ${text}`

	const message = {
		from: process.env.PROD_EMAIL,
		to,
		subject,
		htmlOutput,
		textOutput
	}

	return await sendEmailMessage(message)
}

module.exports = {
	sendPassResetMessage,
	sendContactMessage,
	sendAccountActivationMessage,
	sendNewPupilMessage,
	sendPublicApplyFeedbackMessage,
	sendTestMessage
}
