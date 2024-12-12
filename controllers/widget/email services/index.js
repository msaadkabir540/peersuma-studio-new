const { loginEmail } = require('../../auth/email/login-email');
const {
  peersumaResetPassword,
} = require('../../auth/email/peersuma-reset-password');
const { sendEmailAlan } = require('../send-email-alan');
const { sendEmailCreatedUser } = require('../send-email-created-user');
const { sendEmailUser } = require('../send-email-user');

const sendEmailToUser = ({ videoProjectName, email, token }) => {
  try {
    const videoProjectUrl = `${
      process.env.VIDEO_PROJECT_URL
    }authentication?accessToken=${encodeURIComponent(token)}`;
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Video Project Created',
      html: sendEmailUser({
        videoProjectLink: videoProjectUrl,
        videoProjectName,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const sendLoginEmail = ({ otp, email, loginSide, link, userName }) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Login to Peersuma',
      html: loginEmail({
        otp,
        userName,
        loginSide,
        projectLink: link,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const sendLoginEmailPeersuma = ({ email, link, userName }) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Reset your password',
      html: peersumaResetPassword({
        projectLink: link,
        userName,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const sendEmailCreateUser = ({ videoProjectName, email, token }) => {
  try {
    const videoProjectUrl = `${
      process.env.VIDEO_PROJECT_URL
    }/authentication?accessToken=${encodeURIComponent(token)}`;
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: email,
      subject: 'Video Project Created',
      html: sendEmailCreatedUser({
        videoProjectLink: videoProjectUrl,
        videoProjectName,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

const sendEmailToAlan = ({
  videoProjectName,
  email,
  contactNumber,
  clientName,
}) => {
  try {
    const emailContent = {
      from: process.env.WIDGET_EMAIL_SEND,
      to: process.env.ALAN_EMAIL_ADDRESS,
      subject: 'New user onboard',
      html: sendEmailAlan({
        email,
        contactNumber,
        clientName,
        videoProjectName,
      }),
      email,
    };
    return emailContent;
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendLoginEmail,
  sendEmailToUser,
  sendEmailToAlan,
  sendEmailCreateUser,
  sendLoginEmailPeersuma,
};
