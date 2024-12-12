const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.client = require('./Client');
db.user = require('./User');
db.role = require('./Role');

db.ROLES = ['backend', 'crew', 'executive-producer', 'superadmin', 'producer'];

module.exports = db;
