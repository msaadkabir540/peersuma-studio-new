require('dotenv').config();
const mongoose = require('mongoose');

const db = require('../models');
const Role = db.role;

const dbConnection = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connected) {
      console.info('Connected to the mongoDB');
      initial();
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'crew',
      }).save((err) => {
        if (err) {
          console.error('[crew]-error', err);
        }
      });

      new Role({
        name: 'backend',
      }).save((err) => {
        if (err) {
          console.error('[backend]-error', err);
        }
      });

      new Role({
        name: 'executive-producer',
      }).save((err) => {
        if (err) {
          console.error('[executive-producer]-error', err);
        }
      });

      new Role({
        name: 'producer',
      }).save((err) => {
        if (err) {
          console.error('[producer]-error', err);
        }
      });

      new Role({
        name: 'superadmin',
      }).save((err) => {
        if (err) {
          console.error('[superadmin]-error', err);
        }
      });
    }
  });
}

module.exports = dbConnection;
