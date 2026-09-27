const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Query optimization index on frequently queried fields
taskSchema.index({ createdAt: -1 });
taskSchema.index({ userId: 1 });

module.exports = mongoose.model('Task', taskSchema);
