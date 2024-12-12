const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');

const Projects = mongoose.Schema(
  {
    projectName: String,
    yourName: String,
    templateIds: [
      {
        templateId: { ref: 'template', type: ObjectId },
        uuid: { type: String },
      },
    ],
    templateStyleIds: [
      {
        templateStyleId: { type: ObjectId },
        uuid: { type: String },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    templateThemeIds: {
      type: String,
      objectId: String,
    },
    albumId: {
      ref: 'album',
      type: ObjectId,
    },
    videoProjectId: { type: ObjectId, ref: 'video-project' },
    isEditingProcess: { type: Boolean, default: false },

    templates: [Object],
    projectStatus: {
      type: String,
      enum: ['Opened', 'Closed'],
      default: 'Opened',
    },
    clientId: {
      ref: 'client',
      type: ObjectId,
    },
    finalVideos: [
      mongoose.Schema(
        {
          url: String,
          name: String,
          s3Key: String,
          fileType: String,
          duration: Number,
          thumbnailUrl: String,
        },
        {
          timestamps: true,
        }
      ),
    ],
    finalVideosToMerge: [
      {
        url: String,
        name: String,
        s3Key: String,
        fileType: String,
        duration: Number,
        thumbnailUrl: String,
      },
    ],
    stagingFields: [Object],
    mergeFinalVideo: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model('projects', Projects);
