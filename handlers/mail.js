const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const promisify = require("es6-promisify");

const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth:{
		user:process.env.MAIL_USER,
		pass:process.env.MAIL_PASS
	}
});

const generateHTML = (filename, option={}) =>{
	const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, option);
	const inlined = juice(html);
	return inlined;
};

exports.send = async (option) =>{
	const html = generateHTML(option.filename, option);
	const text = htmlToText.fromString(html);
	const mailOption = {
		from: "PASS <noreply@piotrek.com>",
		to: option.user.email,
		subject: option.subject,
		html,
		text
	};
	const sendMail = promisify(transport.sendMail, transport);
	return sendMail(mailOption)
};