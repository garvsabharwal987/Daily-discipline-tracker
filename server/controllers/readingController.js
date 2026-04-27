const ReadingLog = require('../models/ReadingLog');
const { getTodayDate } = require('../utils/helpers');

// @desc    Get reading log for a specific date
// @route   GET /api/reading?date=YYYY-MM-DD
exports.getReadingLog = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDate();
    const log = await ReadingLog.findOne({ user: req.user._id, date });

    res.status(200).json({ 
      success: true, 
      data: log || { completed: false, articleLink: '', notes: '', date } 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update reading log
// @route   POST /api/reading
exports.upsertReadingLog = async (req, res, next) => {
  try {
    const { completed, articleLink, notes, date } = req.body;
    const logDate = date || getTodayDate();

    const log = await ReadingLog.findOneAndUpdate(
      { user: req.user._id, date: logDate },
      {
        user: req.user._id,
        date: logDate,
        completed: completed !== undefined ? completed : false,
        articleLink: articleLink || '',
        notes: notes || ''
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reading history
// @route   GET /api/reading/history
exports.getReadingHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const logs = await ReadingLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ReadingLog.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};
