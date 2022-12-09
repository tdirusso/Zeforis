const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    ownerOfAccount: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'accounts'
    },
    adminOfClients: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: [],
      ref: 'clients'
    },
    memberOfClients: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: [],
      ref: 'clients'
    },
    memberOfAccounts: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: [],
      ref: 'accounts',
    },
    email: {
      type: String,
      lowercase: true,
      uninque: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    verificationCode: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    jwtToken: String,
    createdAt: {
      type: Number,
      default: () => Date.now()
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('users', User);