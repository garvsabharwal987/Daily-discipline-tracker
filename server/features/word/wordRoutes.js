const express = require('express');
const router = express.Router();
const { getTodayWord } = require('./wordController');
const { protect } = require('../../middleware/auth');

router.get('/today', protect, getTodayWord);

module.exports = router;
