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
				Щоб активувати свій обліковий запис, натисніть на посилання: https://artviva.herokuapp.com/activate/${email}/${activationUUID}
			</li>
			<li>
				Після активації облікового запису адміністратору сайту доведеться переглянути та затвердити ваш рахунок. Після цього ви зможете увійти на сайт і використовувати всі його функції. Ви отримаєте електронне повідомлення з результатами затвердження вашого облікового запису. Дякуємо за терпіння та розуміння.
			</li>
		</ul>`
	const textOutput = `Добрий день, ${name}. Щоб активувати свій обліковий запис, натисніть на посилання: https://artviva.herokuapp.com/activate/${email}/${activationUUID}`

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
		<ul>
			<li>
				Добрий день, ${name}.
			</li>
			<li>
				Щоб скинути пароль, натисніть на посилання: https://artviva.herokuapp.com/reset/${email}/${passResetToken}
			</li>
			<li>
			 <a href="https://artviva.herokuapp.com/reset/${email}/${passResetToken}">Human readable</a>
			</li>
		</ul>`
	const textOutput = `Добрий день, ${name}. Щоб скинути пароль, перейдіть за посиланням: https://artviva.herokuapp.com/reset//${email}/${passResetToken}`

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
		</ul>`
	const textOutput = `У вас є повідомлення від ${name}. Електронна пошта: ${email} Повідомлення: ${text}`

	const message = {
		from: process.env.PROD_EMAIL,
		to: process.env.TEST_EMAIL,
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

	const subject = 'Додано нового учня.'
	const htmlOutput = `
	<h1>Додано нового учня</h1>
	<ul>
		<li>
			Ім'я: ${data.name}
		</li>
		<li>
			Заяву подав: ${data.applicantName}
		</li>
		<li>
			Електронна пошта: ${data.contactEmail}
		</li>
	</ul>`
	const textOutput = `Додано нового учня: ${data.name}. Заяву подав: ${data.applicantName}. Електронна пошта: ${data.contactEmail}`

	const message = {
		from: process.env.PROD_EMAIL,
		to: process.env.TEST_EMAIL,
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
	sendTestMessage
}
