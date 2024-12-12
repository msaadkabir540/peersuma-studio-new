const { sendSMS } = require('../../send-sms');

const sendSMSToUser = async ({ token, contactNumber, videoProjectName }) => {
  const smsBody = `
  Dear User,

Welcome to Peersuma Video Project! We're thrilled to have you on board and excited to embark on this journey together.

Your account has been successfully created, and you now have access to our platform.

A new Video Project ${videoProjectName} has been created and is ready to roll.

click below:
${
  process.env.VIDEO_PROJECT_URL
}/authentication?accessToken=${encodeURIComponent(token)}
 
Thank you for choosing us to bring your video project to life. We're honored to be a part of this journey with you and look forward to creating something truly remarkable together.

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

module.exports = { sendSMSToUser };
