const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER_NAME,
    pass: process.env.EMAIL_HASH_PASSWORD,
  },
});

const sendEmail = async (to, subject, text = '', html = '') => {
  try {
    // Compose the email
    const mailOptions = {
      from: process.env.EMAIL_DEFAULT_SENDER,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('[sendEmail]-Error sending email:', error);
  }
};

module.exports = { sendEmail };
