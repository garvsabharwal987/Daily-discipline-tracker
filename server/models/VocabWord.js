const mongoose = require('mongoose');

const vocabWordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  word: {
    type: String,
    required: [true, 'Please provide a word'],
    trim: true,
    maxlength: [100, 'Word cannot exceed 100 characters']
  },
  meaning: {
    type: String,
    required: [true, 'Please provide a meaning'],
    trim: true,
    maxlength: [500, 'Meaning cannot exceed 500 characters']
  },
  synonyms: [{
    type: String,
    trim: true
  }],
  antonyms: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

vocabWordSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('VocabWord', vocabWordSchema);
