const { WelcomeEmail } = require('./welcome-email');

const sendWelcomeEmail = ({
  email,
  userName,
  clinentName,
  videoProjectLink,
}) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Welcome to Projects peersuma',
      html: WelcomeEmail({
        userName,
        clinentName,
        videoProjectLink,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendWelcomeEmail,
};
