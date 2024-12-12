const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');

const InventoriesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    complexity: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      required: false,
    },
    instructions: {
      type: String,
      required: false,
    },
    userId: {
      type: ObjectId,
      ref: 'user',
    },
    url: String,
    imageName: String,
    s3Key: String,
    fileType: String,
    speakers: Number,
    duration: Number,
    audioUrl: String,
    audioS3Key: String,
    thumbnailUrl: String,
    thumbnailS3Key: String,
    customeThumbnailUrl: String,
    customeThumbnailS3Key: String,
  },
  { timestamps: true }
);

const Inventories = mongoose.model('inventories', InventoriesSchema);

module.exports = {
  Inventories,
  InventoriesSchema,
};
