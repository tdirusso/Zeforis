const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema(
  {
    name: {
      type: String,
      required: true
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