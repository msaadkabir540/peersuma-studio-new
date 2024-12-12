const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

const config = require('../config/auth.js');
const { ObjectId } = require('../utils/helper.js');

const verifyToken = (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.user = decoded;
    next();
  });
};

const ensureAccess = (validRoles) => (req, res, next) => {
  try {
    if (!validRoles.length) {
      return res.status(403).send({ msg: 'Please provide at least one role!' });
    }
    const { roles } = req.user;
    const matchedRole = roles?.find((role) => validRoles?.includes(role));
    if (matchedRole) {
      next();
      return;
    }

    return res.status(403).send({ msg: 'Require Admin Role!' });
  } catch (e) {
    throw new Error(e);
  }
};

const IsAccess = (validRoles) => async (req, res, next) => {
  try {
    // Check if valid roles are provided
    if (!validRoles.length) {
      return res.status(403).json({ msg: 'Please provide at least one role!' });
    }

    const { roles } = req?.user;

    // Allow access for superadmin or backend roles without further checks
    if (roles?.includes('superadmin') || roles?.includes('backend')) {
      return next();
    }

    // Retrieve clientId from query or body
    const clientId = req.query.clientId || req.body.clientId;
    if (!clientId) {
      return res.status(403).json({ msg: 'Client ID is required!' });
    }

    // Find user by ID, selecting only `clientId` for efficiency
    const isUser = await User.findOne(
      { _id: ObjectId(req.user.userId) },
      { clientId: 1 } // Only fetch `clientId` field
    ).lean();

    // Check if the user's client role matches one of the valid roles
    const matchedRole = isUser?.clientId?.some(
      (client) =>
        client.clientId.toString() === clientId &&
        validRoles.includes(client.role)
    );

    if (matchedRole) {
      return next();
    }

    // Deny access if no matching role was found
    return res.status(403).json({ msg: 'Require Admin Role!' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const authJwt = {
  IsAccess,
  verifyToken,
  ensureAccess,
};
module.exports = authJwt;
