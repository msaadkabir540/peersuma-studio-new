const postmark = require('postmark');

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const sendEmail = async (to, subject, text = '', html = '', from, email) => {
  try {
    const fromEmail = process.env.EMAIL_DEFAULT_SENDER;
    // Send the email
    const response = await client.sendEmail({
      From: fromEmail,
      // From: 'noreply@peersuma.com',
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html,
      ReplyTo: email,
    });

    console.info('Email sent successfully!', response);
    return { sucess: true };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

const widgetSendEmail = async ({
  to,
  subject,
  text = '',
  html = '',
  email,
}) => {
  try {
    const fromEmail = process.env.EMAIL_DEFAULT_SENDER;

    // Send the email
    const response = await client.sendEmail({
      // From: 'noreply@peersuma.com',
      From: fromEmail,
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html,
      ReplyTo: email,
    });

    console.info('Email sent successfully!', response);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

const sentEmail = async ({ to, subject, text = '', html = '', email }) => {
  try {
    const fromEmail = process.env.EMAIL_DEFAULT_SENDER;
    // Send the email
    const response = await client.sendEmail({
      From: fromEmail,
      // From: 'noreply@peersuma.com',
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html,
      ReplyTo: email,
    });

    console.info('Email sent successfully!', response);
    return { sucess: true };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sentEmail,
  sendEmail,
  widgetSendEmail,
};
