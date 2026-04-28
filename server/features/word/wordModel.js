const mongoose = require('mongoose');

const WordOfDaySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  meaning: {
    type: String,
    required: true
  },
  synonyms: [String],
  antonyms: [String],
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WordOfDay', WordOfDaySchema);
