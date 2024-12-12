const mongoose = require('mongoose');

const Client = mongoose.model(
  'client',
  new mongoose.Schema(
    {
      url: String,
      name: String,
      state: String,
      S3Key: String,
      status: Boolean,
      website: String,
      district: String,
      thumbnailUrl: String,
      vimeoFolderId: String,
      vimeoFolderName: String,
      userIds: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'users',
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = Client;
