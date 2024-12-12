const mongoose = require('mongoose');

const Template = mongoose.Schema(
  {
    templateName: String,
    description: String,
    ssJson: String,
    UIpy: String,
    templateVideoUrl: String,
    templateVideoS3Key: String,
    templateVideoThumbnailUrl: String,
    templateVideoThumbnailS3Key: String,
    templateStyles: [
      {
        name: String,
        description: String,
        styles_py: String,
        sampleVideoUrl: String,
        sampleVideoS3Key: String,
      },
    ],
    mediaFiles: [
      mongoose.Schema(
        {
          url: String,
          name: String,
          s3Key: String,
          fileType: String,
          fileSize: Number,
          duration: Number,
        },
        {
          timestamps: true,
        }
      ),
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('template', Template);
