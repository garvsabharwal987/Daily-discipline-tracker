const express = require('express');
const router = express.Router();
const { updateNickname } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.patch('/update-nickname', protect, updateNickname);

module.exports = router;
