const { ReminderEmail } = require('./reminder-email');
const { sendEmailVideoRequest } = require('./send-email-user');

const sendEmailToVideoRequest = ({
  year,
  title,
  email,
  dueDate,
  category,
  requestedBy,
  description,
  assignToName,
}) => {
  try {
    const videoProjectLink = `${process.env.VIDEO_PROJECT_URL}/plan`;
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'New Video Request',
      html: sendEmailVideoRequest({
        year,
        title,
        dueDate,
        category,
        description,
        requestedBy,
        assignToName,
        videoProjectLink,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const ReminderEmailONVideoRequest = ({
  year,
  title,
  email,
  dueDate,
  category,
  requestedBy,
  assignToName,
}) => {
  try {
    const videoProjectLink = `${process.env.VIDEO_PROJECT_URL}/plan`;
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Video Project Reminder !',
      html: ReminderEmail({
        year,
        title,
        dueDate,
        category,
        requestedBy,
        assignToName,
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
  sendEmailToVideoRequest,
  ReminderEmailONVideoRequest,
};
