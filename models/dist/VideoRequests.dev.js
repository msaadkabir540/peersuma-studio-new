"use strict";

var mongoose = require('mongoose');

var _require = require('../utils/helper'),
    ObjectId = _require.ObjectId;

var VideoRequestSchema = mongoose.Schema({
  videoRequestName: {
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
  category: {
    type: String,
    required: false
  },
  color: {
    type: String,
    required: false
  },
  dueDate: {
    type: Date,
    required: false
  },
  assignTo: {
    type: ObjectId,
    ref: 'user'
  },
  schoolYear: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  themeId: {
    type: ObjectId,
    ref: 'video-request-themes',
    required: false
  },
  userId: {
    type: ObjectId,
    ref: 'user'
  },
  url: {
    type: String,
    required: false
  },
  s3Key: {
    type: String,
    required: false
  },
  videoName: {
    type: String,
    required: false
  },
  thumbnailUrl: {
    type: String,
    required: false
  },
  thumbnailS3Key: {
    type: String,
    required: false
  },
  sampleThumbnailUrl: {
    type: String,
    required: false
  },
  sampleUrl: {
    type: String,
    required: false
  },
  audioUrl: String,
  audioS3Key: String
}, {
  timestamps: true
});
var VideoRequests = mongoose.model('video-requests', VideoRequestSchema);
module.exports = {
  VideoRequests: VideoRequests,
  VideoRequestSchema: VideoRequestSchema
};