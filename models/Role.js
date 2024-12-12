const mongoose = require('mongoose');

const Role = mongoose.model(
  'role',
  new mongoose.Schema(
    {
      name: String,
    },
    { timestamps: true }
  )
);

module.exports = Role;
