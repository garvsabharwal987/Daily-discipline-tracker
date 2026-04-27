const Streak = require('../models/Streak');
const Task = require('../models/Task');
const VocabWord = require('../models/VocabWord');
const ReadingLog = require('../models/ReadingLog');
const { calculateStreak, getTodayDate } = require('../utils/helpers');

// @desc    Get all streak data for heatmap
// @route   GET /api/streaks
exports.getStreaks = async (req, res, next) => {
  try {
    const streaks = await Streak.find({ user: req.user._id })
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: streaks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get streak stats (current & longest)
// @route   GET /api/streaks/stats
exports.getStreakStats = async (req, res, next) => {
  try {
    const streaks = await Streak.find({ user: req.user._id }).sort({ date: 1 });
    const stats = calculateStreak(streaks);

    const totalCompletedDays = streaks.filter(s => s.allCompleted).length;

    res.status(200).json({ 
      success: true, 
      data: {
        currentStreak: stats.current,
        longestStreak: stats.longest,
        totalCompletedDays
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recalculate and update streak for a date
// @route   PUT /api/streaks/:date
exports.updateStreak = async (req, res, next) => {
  try {
    const date = req.params.date || getTodayDate();

    // Check tasks completion
    const tasks = await Task.find({ user: req.user._id, date });
    const tasksCompleted = tasks.length > 0 && tasks.every(t => t.status === 'completed');

    // Check vocab completion (>= 3 words)
    const vocabCount = await VocabWord.countDocuments({ user: req.user._id, date });
    const vocabCompleted = vocabCount >= 3;

    // Check reading completion
    const readingLog = await ReadingLog.findOne({ user: req.user._id, date });
    const readingCompleted = readingLog ? readingLog.completed : false;

    const allCompleted = tasksCompleted && vocabCompleted && readingCompleted;

    const streak = await Streak.findOneAndUpdate(
      { user: req.user._id, date },
      {
        user: req.user._id,
        date,
        tasksCompleted,
        vocabCompleted,
        readingCompleted,
        allCompleted
      },
      { upsert: true, new: true }
    );

    // Return updated stats too
    const allStreaks = await Streak.find({ user: req.user._id }).sort({ date: 1 });
    const stats = calculateStreak(allStreaks);

    res.status(200).json({ 
      success: true, 
      data: streak,
      stats: {
        currentStreak: stats.current,
        longestStreak: stats.longest
      }
    });
  } catch (error) {
    next(error);
  }
};
