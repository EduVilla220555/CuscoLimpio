const nodemailer = require('nodemailer');
const config = require('../config/env');

const transporter = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	secure: config.email.port === 465,
	auth: {
		user: config.email.user,
		pass: config.email.password
	}
});

async function sendMail({ to, subject, text, html }) {
	const info = await transporter.sendMail({
		from: config.email.from,
		to,
		subject,
		text,
		html
	});
	return info;
}

module.exports = { sendMail };
 
