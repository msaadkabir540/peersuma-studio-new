const { SendEmailOnEditing } = require('./send-email-on-editing');

const sendEmailToUserOnEditing = ({ assignToName, email }) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Project Editing in Progress',
      html: SendEmailOnEditing({
        assignToName,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendEmailToUserOnEditing,
};
