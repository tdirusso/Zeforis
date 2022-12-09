const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Folder = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    client: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'clients'
    },
    parentFolderId: {
      type: String,
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('folders', Folder);