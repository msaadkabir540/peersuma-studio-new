const mongoose = require('mongoose');

const Themes = mongoose.model(
  'themes',
  new mongoose.Schema(
    {
      themeName: String,
      themes_py: String,
      sampleVideoUrl: String,
      sampleVideoS3Key: String,
      themesDescription: String,
      themeVideoThumbnailUrl: String,
    },
    { timestamps: true }
  )
);

module.exports = Themes;
