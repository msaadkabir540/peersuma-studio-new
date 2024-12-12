"use strict";

var mongoose = require('mongoose');

var Joi = require('joi');

var _require = require('../utils/helper'),
    ObjectId = _require.ObjectId;

var VideoProjectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clientId: {
    type: ObjectId,
    ref: 'client',
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    "default": 'in-production'
  },
  isDeleted: {
    type: Boolean,
    "default": false
  },
  createdBy: {
    type: ObjectId,
    ref: 'user'
  },
  createdByUser: {
    type: ObjectId,
    ref: 'user'
  },
  albumId: {
    type: ObjectId,
    ref: 'album'
  },
  projectId: String,
  isEditingProcess: {
    type: Boolean,
    "default": false
  },
  contributor: [{
    userId: {
      type: ObjectId,
      ref: 'user'
    },
    videoProjectId: {
      ref: 'video-project',
      type: ObjectId
    },
    albumShotId: {
      type: ObjectId,
      ref: 'albumshot'
    }
  }]
}, {
  timestamps: true
});
var VideoProject = mongoose.model('video-project', VideoProjectSchema);
var videoProjectJoiSchema = Joi.object({
  createdBy: Joi.string(),
  createdByUser: Joi.string(),
  name: Joi.string().required(),
  clientId: Joi.string().required(),
  description: Joi.string().allow('', null)
});
module.exports = {
  VideoProject: VideoProject,
  videoProjectJoiSchema: videoProjectJoiSchema
};