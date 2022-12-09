const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    accountId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'accounts'
    },
    brandColor: String,
    logoUrl: {
      type: String,
      default: ''
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('clients', Client);