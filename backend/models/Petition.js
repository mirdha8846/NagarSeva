const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  supporters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'successful'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Petition', petitionSchema);
