const mongoose = require('mongoose');

const TemplateMediaCategory = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'template-media-category',
  TemplateMediaCategory
);
