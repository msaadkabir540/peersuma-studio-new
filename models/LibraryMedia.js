const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');

const LibraryMedia = mongoose.Schema(
  {
    name: String,
    description: String,
    reference: String,
    thumbnailUrl: String,
    backgroundColor: String,
    textColor: String,
    widgetUrl: String,
    duration: Number,
    videoUrl: String,
    assetId: String,
    shortLink: String,
    currentModifyDate: Date,
    isUpdate: { type: Boolean, default: true },
    userId: {
      type: ObjectId,
      ref: 'user',
    },
    downloads: [
      {
        quality: String,
        link: String,
      },
    ],
    clientId: {
      ref: 'client',
      type: ObjectId,
    },
    producers: [
      {
        ref: 'user',
        type: ObjectId,
      },
    ],
    album: {
      ref: 'album',
      type: ObjectId,
    },
    active: { type: Boolean, default: true },
    shareable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('library-media', LibraryMedia);
