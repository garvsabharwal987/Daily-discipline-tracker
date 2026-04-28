const express = require('express');
const router = express.Router();
const { getStats, getLeaderboard } = require('./gamificationController');
const { protect } = require('../../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
