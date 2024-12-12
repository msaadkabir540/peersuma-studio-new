const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = async ({ contactNumber, smsBody }) => {
  const number = contactNumber?.includes('+')
    ? contactNumber
    : '+1' + contactNumber;
  const msgData = {
    from: process.env.TWILIO_PHONE,
    to: number,
    body: smsBody,
  };

  try {
    const message = await client.messages.create(msgData);
    console.log(`SMS sent Successfully ${message}`);
    return message;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendSMS,
};
