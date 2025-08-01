const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  complaints: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
