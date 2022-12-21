const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Folder = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    client: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'clients'
    },
    dateCreated: {
      type: Number,
      default: () => Date.now()
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('folders', Folder);