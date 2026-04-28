const cron = require('node-cron');
const wordService = require('./wordService');

/**
 * Initialize cron jobs for word of the day
 */
const initWordCron = () => {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily Word Generation Cron...');
    try {
      const today = new Date().toISOString().split('T')[0];
      await wordService.generateWord(today);
      console.log('Daily Word Generated Successfully');
    } catch (error) {
      console.error('Cron Word Generation Failed:', error.message);
    }
  });

  console.log('Word of the Day Cron Initialized');
};

module.exports = initWordCron;
