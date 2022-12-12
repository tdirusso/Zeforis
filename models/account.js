const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brandColor: String,
    logoUrl: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    members: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'users',
      default: []
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('accounts', Account);