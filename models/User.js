const mongoose = require('mongoose');

const User = mongoose.model(
  'user',
  new mongoose.Schema(
    {
      username: {
        type: String,
        trim: true,
        required: true,
        duplicate: true,
      },
      isAllowContact: {
        type: Boolean,
        default: true,
      },
      fullName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
      status: { type: Boolean, default: true },
      password: String,
      roles: [String],
      otp: {
        type: String,
      },
      token: {
        type: String,
      },
      isDeleted: Boolean,
      contactNumber: String,
      clientId: [
        {
          clientId: { type: mongoose.Types.ObjectId, ref: 'client' },
          role: String,
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = User;
