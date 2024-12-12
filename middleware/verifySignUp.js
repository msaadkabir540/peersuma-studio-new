const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  const { username, email } = req.body;
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).send({ msg: 'Failed! Username is already in use!' });
  }

  // Email
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).send({ msg: 'Failed! Email is already in use!' });
  }

  next();
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
