const axios = require('axios');
const WordOfDay = require('./wordModel');

class WordService {
  /**
   * Generate a new word of the day
   * @param {string} dateStr - YYYY-MM-DD
   */
  async generateWord(dateStr) {
    try {
      let wordData = null;
      let attempts = 0;

      while (!wordData && attempts < 5) {
        attempts++;
        
        // 1. Get a random word
        const randomWordRes = await axios.get('https://random-word-api.herokuapp.com/word?number=1');
        const candidateWord = randomWordRes.data[0];

        // 2. Check if word was already used
        const exists = await WordOfDay.findOne({ word: candidateWord });
        if (exists) continue;

        // 3. Get dictionary details
        try {
          const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${candidateWord}`);
          const entry = dictRes.data[0];

          wordData = {
            word: candidateWord,
            meaning: entry.meanings[0]?.definitions[0]?.definition || 'Definition not available',
            synonyms: entry.meanings[0]?.synonyms?.slice(0, 3) || [],
            antonyms: entry.meanings[0]?.antonyms?.slice(0, 2) || [],
            date: dateStr
          };
        } catch (err) {
          // Dictionary doesn't have this word, try another
          continue;
        }
      }

      if (!wordData) throw new Error('Failed to generate word after several attempts');

      return await WordOfDay.create(wordData);
    } catch (error) {
      console.error('Word Generation Error:', error.message);
      throw error;
    }
  }

  /**
   * Get today's word
   */
  async getTodayWord() {
    const today = new Date().toISOString().split('T')[0];
    let word = await WordOfDay.findOne({ date: today });

    if (!word) {
      word = await this.generateWord(today);
    }

    return word;
  }
}

module.exports = new WordService();
