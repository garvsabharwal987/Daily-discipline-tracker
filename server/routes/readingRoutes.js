const express = require('express');
const router = express.Router();
const { getReadingLog, upsertReadingLog, getReadingHistory } = require('../controllers/readingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getReadingLog).post(upsertReadingLog);
router.get('/history', getReadingHistory);

module.exports = router;
