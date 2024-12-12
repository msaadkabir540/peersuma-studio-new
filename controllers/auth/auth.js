const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('../../models');
const config = require('../../config/auth');

const { VideoProject } = require('../../models/VideoProject');

const {
  sendLoginEmail,
  sendLoginEmailPeersuma,
} = require('../widget/email services');
const {
  sendLoginSMS,
  sendEmailToAlanOnBoding,
  sendResetPasswordSMS,
} = require('./send-sms');
const { sentEmail } = require('../../utils/emailByPostmark');

const { VideoProjectDataDelete, handleAllClientRolesFun } = require('./helper');
const Client = require('../../models/Client');

const User = db.user;

exports.signUp = async (req, res) => {
  try {
    const {
      email,
      roles,
      password,
      clientId,
      username,
      fullName,
      createdByUser,
      contactNumber,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }
    let query = {};

    if (contactNumber) {
      query = {
        $or: [{ email }, { contactNumber }],
      };
    } else {
      query = { email };
    }

    let user = await User.findOne(query);

    if (user) {
      const clientIds = user?.clientId?.map((client) =>
        client.clientId.toString()
      );

      if (clientIds?.includes(clientId)) {
        let userContact;
        if (contactNumber) {
          userContact = await User.findOne({ contactNumber });
        }
        let userEmail = await User.findOne({ email });
        if (userContact) {
          return res
            .status(400)
            .json({ msg: 'Contact number already exists in this school' });
        }
        if (userEmail) {
          return res
            .status(400)
            .json({ msg: 'Email already exists in this school' });
        } else {
          return res
            .status(400)
            .json({ msg: 'User already exists in this school' });
        }
      }
      user.clientId.push({ clientId, role: roles?.[0], createdByUser });
    } else {
      // If user does not exist, create a new user
      user = await User.create({
        email,
        roles: roles,
        username: username,
        fullName: fullName,
        contactNumber: contactNumber,
        password: bcrypt.hashSync(password, 8),
        clientId: [
          {
            clientId,
            role: roles?.[0],
            createdByUser,
          },
        ],
      });
    }

    await user.save();

    return res.status(200).json({ msg: 'User registered successfully!' });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ msg: 'Interval server error' });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { password, emailContact } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailContact }, { username: emailContact }],
    })
      .populate('clientId', '-__v')
      .lean();

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }
    if (!user) {
      return res
        .status(404)
        .send({ message: 'Please contact Admin, Your profile is inactive!' });
    }
    if (user?.roles?.[0] !== 'superadmin' && user?.roles?.[0] !== 'backend') {
      return res.status(404).send({ message: 'User not allow to login' });
    }

    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password!' });
    }
    let token;

    token = jwt.sign({ ...user }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    user.token = token;

    if (user?.roles?.[0] === 'superadmin') {
      delete user.clientId;
    }

    res.status(200).send({ ...user });
  } catch (error) {
    return error;
  }
};

exports.signInEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email })
    .populate('clientId', '-__v')
    .lean();
  if (!user) {
    return res.status(404).send({ message: 'User Not found.' });
  }
  if (!user?.status) {
    return res
      .status(404)
      .send({ message: 'Please contact Admin, Your profile is inactive!' });
  }

  const token = jwt.sign({ ...user }, config.secret, {
    algorithm: 'HS256',
    allowInsecureKeySizes: true,
  });

  user.token = token;

  res.status(200).send({ ...user });
};

exports.signOut = async (req, res) => {
  try {
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send({ message: "user with given email doesn't exist" });

    if (!user.token) {
      user.token = crypto.randomBytes(32).toString('hex');
      await user.save();
    }

    const link = `${process.env.CLIENT_BASE_URL}/password-reset/${user._id}/${user.token}`;

    const emailResponse = await sendLoginEmailPeersuma({
      email: user.email,
      userName: user.username || user.fullName,
      link,
    });

    const smsBody = `
      Hello ${user.username || user.fullName},

      You have request to forget password, Please click on below link to reset your password
      ${link}
    `;

    if (user?.contactNumber) {
      await sendResetPasswordSMS({
        SMSBody: smsBody,
        contactNumber: user?.contactNumber,
      });
    }
    const result = await sentEmail(emailResponse);
    return res.status(200).send({
      message:
        'An email containing reset password link sent to your provided email.',
      response: result,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.setAndValidatePassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({
      _id: req.params.userId,
      token: req.params.token,
    });

    if (!user) return res.status(400).send('invalid link or expired');

    user.password = bcrypt.hashSync(req.body.password, 8);
    user.token = '';
    await user.save();

    res.send('Password reset Successfully.');
  } catch (err) {
    res.send(err.message);
    console.error('[setAndValidatePassword]-error', err);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    const schema = Joi.object({
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).json({ msg: 'invalid link or expired' });

    user.password = bcrypt.hashSync(password, 8);
    await user.save();

    res.send({ msg: 'Password reset Successfully.' });
  } catch (err) {
    res.send(err.message);
    console.error('[changePassword]-error', err);
  }
};

// decode the jwt token and find the user
const parseJwt = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

exports.isUserAuthentic = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const decoded = await parseJwt(accessToken);

    const userId = decoded?._doc?._id || decoded.userId;
    const user = await User.findOne({ _id: userId })
      .populate('clientId', '-__v')
      .lean();
    if (!user) {
      return res.status(401).send({ message: 'user not found' });
    }

    const selectedClientIdResult =
      decoded?.clientId?.length > 1
        ? decoded?.clientId?.find((data) => data?.role !== 'producer') ||
          decoded?.clientId?.[0]
        : decoded?.clientId?.[0];

    user.token = accessToken;
    user.selectedClientId =
      decoded?.selectedClientId || selectedClientIdResult?.clientId;
    user.contributor = decoded?.contributor;
    const videoProjectId = decoded.videoProjectId;

    if (videoProjectId) {
      const videoProject = await VideoProject.findOne({ _id: videoProjectId });
      if (!videoProject) {
        return res.status(401).send({ message: 'video project not found' });
      } else {
        res.status(200).send({ ...user, videoProject });
      }
    } else {
      res.status(200).send({ ...user });
    }
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized!' });
  }
};

exports.loginUserByOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ otp })
      .populate('clientId', '-__v')
      .lean();
    if (!user) {
      return res.status(401).send({ message: 'user not found' });
    }

    const decoded = await parseJwt(user?.token);

    const selectedClientIdResult =
      decoded?.clientId?.length > 1
        ? decoded?.clientId?.find((data) => data?.role !== 'producer') ||
          decoded?.clientId?.[0]
        : decoded?.clientId?.[0];

    user.token = user?.token;
    user.selectedClientId =
      decoded?.selectedClientId || selectedClientIdResult?.clientId;
    user.contributor = decoded?.contributor;
    const videoProjectId = decoded.videoProjectId;

    const { password, ...restUser } = user;

    if (videoProjectId) {
      const videoProject = await VideoProject.findOne({ _id: videoProjectId });
      if (!videoProject) {
        res.status(401).send({ message: 'video project not found' });
      } else {
        res.status(200).send({ ...restUser, videoProject });
      }
    } else {
      res.status(200).send({ ...restUser });
    }
    await User.updateOne({ _id: user._id }, { $unset: { otp: '', token: '' } });
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized!' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, contactNumber, clientId, role } = req.body;
    const clientIds = clientId;

    console.table({ name, email, contactNumber, clientId, role });

    let user = await User.findOne({
      $or: [{ email: email }, { contactNumber: contactNumber }],
    }).populate('clientId', '-__v');
    if (user) {
      let message = 'User already exists';
      user.email === email
        ? (message = 'Email already exists')
        : user.contactNumber === contactNumber
          ? (message = 'Contact number already exists')
          : (message = 'User already exists');

      return res.status(400).send({
        message: message,
        status: 400,
      });
    } else {
      // Create a new user since no user exists with the provided email or contactNumber
      const hashedPassword = bcrypt.hashSync('123456', 8);
      const newUser = await User.create({
        username: name,
        fullName: name,
        status: true,
        email: email,
        contactNumber: contactNumber,
        password: hashedPassword,
        clientId: clientIds
          ? [{ clientId: clientIds, role: role || 'producer' }]
          : [],
        roles: role || 'producer',
        // Create an array with the provided clientId
      });
      const tokenData = {
        userId: newUser?._id,
        roles: newUser?.roles,
        clientId: newUser?.clientId,
        selectedClientId: clientId,
      };
      const token = jwt.sign({ ...tokenData }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
      });
      newUser.token = token;
      let result;

      const projectsPeersuma = `${
        process.env.VIDEO_PROJECT_URL
      }/authentication?accessToken=${encodeURIComponent(token)}`;

      const numberOtp = Math.floor(1000 + Math.random() * 9000);

      newUser.otp = numberOtp;
      newUser.token = token;
      await newUser.save();

      let emailFormateResult;
      if (newUser?.email) {
        emailFormateResult = sendLoginEmail({
          otp: numberOtp,
          email: newUser?.email,
          link: projectsPeersuma,
          loginSide: 'projects.peersuma',
          userName: newUser?.username || newUser?.fullName,
        });
      }

      result = await sentEmail(emailFormateResult);

      if (newUser?.isAllowContact) {
        await sendLoginSMS({
          otp: numberOtp,
          siteName: 'project.peersuma.com',
          link: projectsPeersuma,
          contactNumber: newUser?.contactNumber,
        });
      }

      // send mail to alan onboarding time
      const alanMail = sendEmailToAlanOnBoding({ email, contactNumber });
      await sentEmail(alanMail);

      return res
        .status(200)
        .send({ otp: numberOtp, userData: result, status: 200 });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.isUserExit = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const user = await User.findOne({
      $or: [{ email: searchTerm }, { contactNumber: searchTerm }],
    });

    if (!user) {
      return res.status(404).send({ message: 'User Not found.', status: 404 });
    }

    return res.status(200).send({ ...user });
  } catch (error) {
    return error;
  }
};

const rolesArray = ['backend'];

exports.userVerification = async (req, res) => {
  try {
    const { emailContact, isContact, clientId } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailContact }, { contactNumber: emailContact }],
    });
    if (!user) {
      return res.status(404).send({ message: 'User Not found.', status: 404 });
    }

    if (rolesArray.includes(user?.roles?.[0])) {
      const tokenData = {
        userId: user?._id,
        roles: user?.roles,
      };

      const token = jwt.sign({ ...tokenData }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
      });

      user.token = token;

      const handleAllClientRoles = await handleAllClientRolesFun();

      if (!Array.isArray(user.clientId)) {
        user.clientId = [];
      }

      user.clientId = [...handleAllClientRoles];

      user.selectedClientId = user.clientId?.[0]?.clientId?._id;

      return res.status(200).send({ userData: user });
    }
    if (clientId) {
      const checkClientExist = user?.clientId?.find(
        (data) => data?.clientId.toString() === clientId
      );
      if (!checkClientExist) {
        user.clientId.push({ clientId: clientId, role: 'producer' });
        await user.save();
      }
    }
    user.isAllowContact = isContact;
    await user.save();

    const tokenData = {
      userId: user?._id,
      roles: user?.roles,
      clientId: user.clientId,
    };
    let emailFormateResult;
    let result;

    const token = jwt.sign({ ...tokenData }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
    });
    const projectsPeersuma = `${
      process.env.VIDEO_PROJECT_URL
    }/authentication?accessToken=${encodeURIComponent(token)}`;

    const numberOtp = Math.floor(1000 + Math.random() * 9000);

    user.otp = numberOtp;
    user.token = token;
    await user.save();
    if (user?.email) {
      emailFormateResult = sendLoginEmail({
        otp: numberOtp,
        email: user?.email,
        link: projectsPeersuma,
        loginSide: 'projects.peersuma',
        userName: user?.username || user?.fullName,
      });
    }

    result = await sentEmail(emailFormateResult);

    if (user?.isAllowContact) {
      await sendLoginSMS({
        otp: numberOtp,
        siteName: 'project.peersuma.com',
        link: projectsPeersuma,
        contactNumber: user?.contactNumber,
      });
    }

    return res.status(200).send({
      otp: numberOtp,
      sendEmail: result,
      msg: 'Email sent Successfully',
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

exports.handleIncomingMessage = async (req, res) => {
  const messageBody = req.body.Body; // Content of the SMS
  const fromNumber = req.body.From; // Sender's phone number

  console.log(`Received message from ${fromNumber}: ${messageBody}`);

  if (messageBody.toLowerCase() === 'stop') {
    await updateUserContext({ fromNumber, isContext: false });
  }

  // Respond to Twilio to acknowledge receipt of the message
  res.send('<Response></Response>');
};

const updateUserContext = async ({ phoneNumber, isContext }) => {
  try {
    const contentNumber = phoneNumber?.replace(/[^0-9]/g, '')?.slice(-10);

    const user = await User.findOne({ contentNumber });
    if (user) {
      user.isAllowContact = isContext;
      await user.save();
      console.log(`Updated user ${contentNumber} context to ${isContext}`);
    } else {
      console.log(`User with phone number ${contentNumber} not found`);
    }
  } catch (err) {
    console.error('Error updating user context:', err);
  }
};

// logout the demo school and reset the all demo data only admin data remains

exports.DemoSchoolLogout = async (req, res) => {
  try {
    const deleteVideoProjectByClientId = await VideoProjectDataDelete({
      clientId: process.env.DEMO_SCHOOL_ID,
    });

    if (!deleteVideoProjectByClientId) {
      return res.status(404).send({ message: 'User Not found.', status: 404 });
    }

    return res.status(200).send({ msg: 'Data successfully restore' });
  } catch (error) {
    return error;
  }
};
