const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');

const TemplateMedia = mongoose.Schema(
  {
    url: String,
    name: String,
    s3Key: String,
    description: String,
    fileType: String,
    fileSize: Number,
    duration: Number,
    thumbnailUrl: String,
    thumbnailS3Key: String,
    categories: [
      {
        ref: 'template-media-category',
        type: ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('template-media', TemplateMedia);
