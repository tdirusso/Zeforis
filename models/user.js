const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      lowercase: true,
      uninque: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['Client', 'Administrator'],
      default: 'Client'
    },
    jwtToken: String
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('users', User);