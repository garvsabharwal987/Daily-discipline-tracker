const wordService = require('./wordService');

// @desc    Get today's word of the day
// @route   GET /api/word/today
exports.getTodayWord = async (req, res, next) => {
  try {
    const word = await wordService.getTodayWord();
    res.status(200).json({
      success: true,
      data: word
    });
  } catch (error) {
    next(error);
  }
};
