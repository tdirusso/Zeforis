const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    brandColor: String,
    folders: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'folders'
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('clients', Client);