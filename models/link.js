const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Default', 'Google', 'Word'],
      default: 'Default'
    },
    folderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'folders',
      required: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('links', Link);