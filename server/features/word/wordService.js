const axios = require('axios');
const WordOfDay = require('./wordModel');

const FALLBACK_WORDS = [
  { word: 'resilience', meaning: 'The capacity to recover quickly from difficulties; toughness.', synonyms: ['toughness', 'flexibility', 'durability'], antonyms: ['fragility', 'weakness'] },
  { word: 'discipline', meaning: 'The practice of training people to obey rules or a code of behavior.', synonyms: ['training', 'control', 'order'], antonyms: ['chaos', 'disorder'] },
  { word: 'consistency', meaning: 'Conformity in the application of something, typically that which is necessary for the sake of logic, accuracy, or fairness.', synonyms: ['steadiness', 'regularity', 'uniformity'], antonyms: ['instability', 'irregularity'] },
  { word: 'persistence', meaning: 'Firm or obstinate continuance in a course of action in spite of difficulty or opposition.', synonyms: ['determination', 'perseverance', 'tenacity'], antonyms: ['hesitation', 'indecision'] }
];

class WordService {
  /**
   * Generate a new word of the day
   * @param {string} dateStr - YYYY-MM-DD
   */
  async generateWord(dateStr) {
    try {
      console.log(`🔍 Generating word for ${dateStr}...`);
      let wordData = null;
      let attempts = 0;

      while (!wordData && attempts < 8) {
        attempts++;
        
        try {
          // 1. Get a random word
          const randomWordRes = await axios.get('https://random-word-api.herokuapp.com/word?number=1', { timeout: 5000 });
          const candidateWord = randomWordRes.data[0];

          // 2. Check if word was already used
          const exists = await WordOfDay.findOne({ word: candidateWord });
          if (exists) continue;

          // 3. Get dictionary details
          const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${candidateWord}`, { timeout: 5000 });
          const entry = dictRes.data[0];

          // Find the first available definition by searching all meanings
          let definition = '';
          let synonyms = [];
          let antonyms = [];

          for (const meaning of entry.meanings) {
            if (!definition && meaning.definitions?.[0]?.definition) {
              definition = meaning.definitions[0].definition;
            }
            if (synonyms.length < 3 && meaning.synonyms?.length > 0) {
              synonyms = [...new Set([...synonyms, ...meaning.synonyms])].slice(0, 3);
            }
            if (antonyms.length < 2 && meaning.antonyms?.length > 0) {
              antonyms = [...new Set([...antonyms, ...meaning.antonyms])].slice(0, 2);
            }
          }

          if (definition) {
            wordData = {
              word: candidateWord,
              meaning: definition,
              synonyms,
              antonyms,
              date: dateStr
            };
          }
        } catch (err) {
          // API error or word not found, try next attempt
          continue;
        }
      }

      if (!wordData) {
        console.log('⚠️ Could not generate word from APIs, using fallback.');
        const fallback = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
        wordData = { ...fallback, date: dateStr };
      }

      // Check if word already exists for this date (prevent race conditions)
      const existingForDate = await WordOfDay.findOne({ date: dateStr });
      if (existingForDate) return existingForDate;

      console.log(`✅ Generated word: ${wordData.word}`);
      return await WordOfDay.create(wordData);
    } catch (error) {
      console.error('❌ Word Generation Error:', error.message);
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
