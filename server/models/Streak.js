const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  tasksCompleted: {
    type: Boolean,
    default: false
  },
  vocabCompleted: {
    type: Boolean,
    default: false
  },
  readingCompleted: {
    type: Boolean,
    default: false
  },
  allCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

streakSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Streak', streakSchema);
