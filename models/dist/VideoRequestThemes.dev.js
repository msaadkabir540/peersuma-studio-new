"use strict";

var mongoose = require('mongoose');

var _require = require('../utils/helper'),
    ObjectId = _require.ObjectId;

var VideoRequestThemesSchema = mongoose.Schema({
  themeName: {
    type: String,
    required: true
  },
  clientId: {
    type: ObjectId,
    ref: 'client',
    required: true
  },
  fromDate: {
    type: Date,
    required: false
  },
  schoolYear: {
    type: String,
    required: false
  },
  toDate: {
    type: Date,
    required: false
  },
  themeColor: {
    type: String,
    required: false
  },
  videoRequestIds: [{
    orderNumber: Number,
    videoRequestId: {
      type: ObjectId,
      ref: 'video-requests'
    }
  }],
  userId: {
    type: ObjectId,
    ref: 'user'
  }
}, {
  timestamps: true
});
var VideoRequestThemes = mongoose.model('video-request-themes', VideoRequestThemesSchema);
module.exports = {
  VideoRequestThemes: VideoRequestThemes,
  VideoRequestThemesSchema: VideoRequestThemesSchema
};