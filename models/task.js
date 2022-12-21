const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema(
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
    status: {
      type: String,
      required: true,
      enum: [
        'New',
        'Not Started',
        'Next Up',
        'In Progress',
        'Currently Writing',
        'Pending Approval',
        'Approved',
        'Ready to Implement',
        'Complete'
      ],
      default: 'New'
    },
    folder: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'folders',
      required: true
    },
    linkUrl: {
      type: String,
      trim: true
    },
    tag: {
      type: String,
      trim: true
    },
    assignedTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users'
    },
    progress: {
      type: Number,
      required: true,
      default: 0
    },
    dateCompleted: {
      type: Number
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

module.exports = mongoose.model('tasks', Task);