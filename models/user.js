const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstName: String,
    lastName: String,
    ownerOfAccountId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'accounts'
    },
    adminOfClientIds: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'clients'
    },
    userOfClientIds: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'clients'
    },
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
    invitationCode: String,
    verificationCode: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    jwtToken: String
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('users', User);