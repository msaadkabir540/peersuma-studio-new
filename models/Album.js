const mongoose = require('mongoose');
const Joi = require('joi');

const { ObjectId } = require('../utils/helper');
///
const AlbumSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clientId: {
      type: ObjectId,
      ref: 'client',
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEditingProcess: { type: Boolean, default: false },
    albumshots: [{ type: ObjectId, ref: 'albumshot' }],
    status: {
      type: String,
      enum: ['open', 'closed', 'inactive'],
      default: 'open',
    },
    producers: [
      {
        type: ObjectId,
        ref: 'user',
      },
    ],
    createdBy: {
      type: ObjectId,
      ref: 'user',
    },
    createdByUser: {
      type: ObjectId,
      ref: 'user',
    },
    thumbnailUrl: String,
  },
  { timestamps: true }
);

const Album = mongoose.model('album', AlbumSchema);

const albumJoiSchema = Joi.object({
  createdBy: Joi.string(),
  createdByUser: Joi.string(),
  name: Joi.string().required(),
  clientId: Joi.string().required(),
  producers: Joi.array().items(Joi.string()),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('open', 'closed', 'inactive'),
});

module.exports = {
  Album,
  albumJoiSchema,
};
