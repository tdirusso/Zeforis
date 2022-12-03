const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    brandColor: String
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('clients', Client);