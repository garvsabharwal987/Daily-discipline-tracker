const express = require('express');
const router = express.Router();
const { getMonthSummary } = require('./calendarController');
const { protect } = require('../../middleware/auth');

router.get('/month', protect, getMonthSummary);

module.exports = router;
