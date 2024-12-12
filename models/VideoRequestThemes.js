const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');

const VideoRequestThemesSchema = mongoose.Schema(
  {
    themeName: {
      type: String,
      required: true,
    },
    clientId: {
      type: ObjectId,
      ref: 'client',
      required: true,
    },
    fromDate: {
      type: Date,
      required: false,
    },
    schoolYear: {
      type: String,
      required: false,
    },
    toDate: {
      type: Date,
      required: false,
    },
    themeColor: {
      type: String,
      required: false,
    },
    videoRequestIds: [
      {
        orderNumber: Number,
        videoRequestId: {
          type: ObjectId,
          ref: 'video-requests',
        },
      },
    ],
    userId: {
      type: ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const VideoRequestThemes = mongoose.model(
  'video-request-themes',
  VideoRequestThemesSchema
);

module.exports = {
  VideoRequestThemes,
  VideoRequestThemesSchema,
};
