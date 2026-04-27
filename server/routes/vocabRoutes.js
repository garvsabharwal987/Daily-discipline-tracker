const express = require('express');
const router = express.Router();
const { getWords, getHistory, addWord, updateWord, deleteWord } = require('../controllers/vocabController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getWords).post(addWord);
router.get('/history', getHistory);
router.route('/:id').put(updateWord).delete(deleteWord);

module.exports = router;
