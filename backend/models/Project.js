const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  budgetAllocated: {
    type: Number,
    required: true
  },
  budgetUsed: {
    type: Number,
    default: 0
  },
  timeline: {
    startDate: Date,
    endDate: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'on_hold'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
