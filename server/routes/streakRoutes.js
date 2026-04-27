const express = require('express');
const router = express.Router();
const { getStreaks, getStreakStats, updateStreak } = require('../controllers/streakController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getStreaks);
router.get('/stats', getStreakStats);
router.put('/:date', updateStreak);

module.exports = router;
