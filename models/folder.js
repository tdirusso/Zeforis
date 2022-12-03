const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Folder = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    clientId: {
      type: String,
      required: true
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