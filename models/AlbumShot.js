const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');
const Joi = require('joi');

const AlbumShotSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    album: {
      type: ObjectId,
      ref: 'album',
    },
    userId: String,
    dueDate: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    media: [
      mongoose.Schema(
        {
          url: String,
          name: String,
          s3Key: String,
          fileType: String,
          speakers: Number,
          duration: Number,
          thumbnailUrl: String,
          transcription: Object,
          thumbnailS3Key: String,
          userId: {
            type: ObjectId,
            ref: 'user',
          },
          isVisible: {
            type: Boolean,
            default: true,
          },
        },
        {
          timestamps: true,
          versionKey: false,
        }
      ),
    ],
    invites: [
      {
        id: String,
        lastInvited: String,
      },
    ],
    shotUrl: {
      type: String,
      required: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const AlbumShot = mongoose.model('albumshot', AlbumShotSchema);

const albumshotJoiSchema = Joi.object({
  name: Joi.string().required(),
  album: Joi.string().required(),
  dueDate: Joi.date().allow(null, ''),
  description: Joi.string().allow(null, ''),
});

module.exports = {
  AlbumShot,
  albumshotJoiSchema,
};
