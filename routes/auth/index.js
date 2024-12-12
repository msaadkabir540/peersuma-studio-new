const express = require('express');
const { checkRolesExisted } = require('../../middleware/verifySignUp');
const { verifyToken } = require('../../middleware/authJwt');
const {
  signUp,
  signIn,
  signOut,
  createUser,
  isUserExit,
  signInEmail,
  forgotPassword,
  changePassword,
  isUserAuthentic,
  userVerification,
  setAndValidatePassword,
  loginUserByOTP,
  DemoSchoolLogout,
} = require('../../controllers/auth/auth');

const app = express.Router();

app.post('/signIn', signIn);
app.post('/signOut', signOut);
app.post('/create-user', createUser);
app.post('/signIn-email', signInEmail);
app.post('/is-user-exist', isUserExit);
app.post('/forgot-password', forgotPassword);
app.post('/user-verification', userVerification);
app.post('/login-user-by-otp', loginUserByOTP);
app.post('/is-user-authentication', isUserAuthentic);
app.post('/signup', checkRolesExisted, verifyToken, signUp);
app.post('/set-password/:userId/:token', setAndValidatePassword);
app.post('/reset-password/:userId', verifyToken, changePassword);
// delete the all user data from demo school
app.post('/demo-school-logout', DemoSchoolLogout);

module.exports = app;
