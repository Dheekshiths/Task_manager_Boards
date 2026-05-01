const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      maxlength: 100,
    },
    details: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

activitySchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
