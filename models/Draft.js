const mongoose = require('mongoose');
const { ObjectId } = require('../utils/helper');

const VideoDraft = mongoose.model(
  'VideoDraft',
  new mongoose.Schema(
    {
      comments: [
        {
          userId: {
            type: ObjectId,
            ref: 'user',
          },
          createdAt: String,
          comment: String,
        },
      ],
      videoProjectId: {
        ref: 'video-project',
        type: ObjectId,
      },
      clientId: {
        ref: 'client',
        type: ObjectId,
      },
      draftVideo: [
        {
          url: String,
          name: String,
          s3Key: String,
          fileType: String,
          duration: Number,
          thumbnailUrl: String,
          _id: String,
          createdAt: String,
        },
      ],
    },
    { timestamps: true }
  )
);

module.exports = VideoDraft;
