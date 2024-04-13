const nodemailer = require("nodemailer");
import HTML_TEMPLATE from "./mail-template.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "MAILID@gmail.com",
        pass: "YOUR PASSWORD",
    },
});

const sendEmail = async (to, subject, text) => {
    const info = await transporter.sendMail({
        from: "TESTING <sender@gmail.com>", // sender address
        to: to,
        subject: subject, // Subject line
        text: text, // plain text body
        html: HTML_TEMPLATE(text), // html body
    });
    console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;