const { sendSMS } = require('../../send-sms');
const { sendInviteEmailBody } = require('./send-invite-email');
const { sendStatusEmail } = require('./send-status-email');

const sendEmailOnStatusChange = ({
  videoProjectName,
  oldStatus,
  newStatus,
  email,
  Name,
  id,
}) => {
  try {
    const videoProjectUrl = `${process.env.VIDEO_PROJECT_URL}/produce/${id}`;
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Video Status Updated',
      html: sendStatusEmail({
        Name: Name,
        oldStatus: oldStatus,
        newStatus: newStatus,
        projectLink: videoProjectUrl,
        projectName: videoProjectName,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const sendInviteEmail = ({
  Note,
  email,
  shotName,
  shotLink,
  userName,
  emailNote,
  signUpLink,
  sendByUser,
  clientName,
  videoProjectName,
}) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Invitation to Scene',
      html: sendInviteEmailBody({
        Note,
        userName,
        signUpLink,
        sendByUser,
        videoProjectName,
        shotName: shotName,
        emailNote: emailNote,
        clientName: clientName,
        shotUploadLink: shotLink,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const sendStatusChangeSMS = async ({
  userId,
  newStatus,
  oldStatus,
  contactNumber,
  videoProjectId,
  videoProjectName,
  shotLink,
}) => {
  const smsBody = `
  Dear User,

invitation to upload Media shot

The status of your Project ${videoProjectName} has been updated from ${oldStatus} to ${newStatus}

click Below:
${shotLink}
${process.env.VIDEO_PROJECT_URL}/video-project/${videoProjectId}uploaded${userId}
  
  Regards,
  Team Peersuma
  Reply STOP to unsubscribe from SMS service.
  `;

  try {
    const sendMessage = await sendSMS({ contactNumber, smsBody });
    return sendMessage;
  } catch (error) {
    console.error(error);
  }
};

const sendInviteShotSMS = async ({
  contactNumber,
  shotUploadLink,
  clientName,
  shotName,
}) => {
  const smsBody = `
  Dear User,

Congratulations!

You have been invited by ${clientName} to ${shotName} as a contributor.

click Below:

${shotUploadLink}
  
  Regards,
  Team Peersuma
  Reply STOP to unsubscribe from SMS service.
  `;

  try {
    const sendMessage = await sendSMS({ contactNumber, smsBody });
    return sendMessage;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendEmailOnStatusChange,
  sendStatusChangeSMS,
  sendInviteShotSMS,
  sendInviteEmail,
};
