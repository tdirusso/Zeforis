const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Folder = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    clientId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'clients'
    },
    parentFolderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'folders'
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('folders', Folder);