const {
  EmailToAlanOnboarding,
} = require('../../email-helper/email-alan-onbording');
const { sendSMS } = require('../../send-sms');

const sendLoginSMS = async ({ siteName, contactNumber, link, otp }) => {
  const smsBody = `
  Dear User,

  You have requested to login to ${siteName}
  OTP:${otp}

${link}
  
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

const sendResetPasswordSMS = async ({ SMSBody, contactNumber }) => {
  const smsBody = `
${SMSBody}

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

const sendEmailToAlanOnBoding = ({ email, contactNumber }) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: process.env.ALAN_EMAIL_ADDRESS,
      subject: 'New user onboard',
      html: EmailToAlanOnboarding({
        email,
        contactNumber,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendLoginSMS,
  sendResetPasswordSMS,
  sendEmailToAlanOnBoding,
};
