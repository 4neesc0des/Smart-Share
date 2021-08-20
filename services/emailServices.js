const nodemailer = require("nodemailer");

const sendEmail = async ({ from, to, subject, text, html }) => {
  let transpoter = nodemailer.createTransport({
    host: process.env.SMTPHOST,
    port: process.env.SMTPPORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let info = await transpoter.sendMail({
    from: `smartShare <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
};

module.exports = sendEmail;
