const mongoose = require('mongoose');

const { ObjectId } = require('../utils/helper');

const Widget = mongoose.Schema(
  {
    name: String,
    description: String,
    clientId: {
      ref: 'client',
      type: ObjectId,
    },
    producers: [
      {
        ref: 'User',
        type: ObjectId,
      },
    ],
    colorPalette: String,
    textColor: String,
    buttonColor: String,
    thumbnailColor: String,
    backgroundColor: String,
    buttonTextColor: String,
    hyperTextColor: String,
    shareColor: String,
    tryNowButtonTextColor: String,
    tryNowButtonColor: String,
    titleColor: String,
    thumbnailTitleColor: String,
    hyperTitleColor: String,
    active: { type: Boolean, default: true },
    showTitle: { type: Boolean, default: true },
    showDescription: { type: Boolean, default: true },
    showGetStarted: { type: Boolean, default: true },
    showSubscribers: { type: Boolean, default: true },
    enableShare: { type: Boolean, default: true },
    enableSubscribe: { type: Boolean, default: true },
    widgetTemplate: {
      type: String,
      enum: ['carousel', 'slideshow', 'thumbnailGrid', 'verticalStack'],
      default: 'carousel',
    },
    media: [
      {
        order: { type: Number },
        _id: {
          type: ObjectId,
          ref: 'library-media',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('widget', Widget);
