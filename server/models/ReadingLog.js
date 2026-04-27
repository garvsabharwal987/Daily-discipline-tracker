const mongoose = require('mongoose');

const readingLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  articleLink: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    default: ''
  }
}, {
  timestamps: true
});

readingLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ReadingLog', readingLogSchema);
