const Task = require('../models/Task');
const VocabWord = require('../models/VocabWord');
const ReadingLog = require('../models/ReadingLog');
const Streak = require('../models/Streak');
const { calculateStreak, getTodayDate } = require('../utils/helpers');

// @desc    Get aggregated dashboard stats
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = getTodayDate();

    // Tasks stats
    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ user: req.user._id, status: 'completed' });
    const todayTasks = await Task.countDocuments({ user: req.user._id, date: today });
    const todayCompletedTasks = await Task.countDocuments({ user: req.user._id, date: today, status: 'completed' });

    // Vocab stats
    const totalWords = await VocabWord.countDocuments({ user: req.user._id });
    const todayWords = await VocabWord.countDocuments({ user: req.user._id, date: today });

    // Reading stats
    const totalReadingDays = await ReadingLog.countDocuments({ user: req.user._id, completed: true });
    const todayReading = await ReadingLog.findOne({ user: req.user._id, date: today });

    // Streak stats
    const streaks = await Streak.find({ user: req.user._id }).sort({ date: 1 });
    const streakStats = calculateStreak(streaks);
    const totalCompletedDays = streaks.filter(s => s.allCompleted).length;

    // Weekly task data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = await Task.find({ user: req.user._id, date: dateStr });
      const dayVocab = await VocabWord.countDocuments({ user: req.user._id, date: dateStr });
      const dayReading = await ReadingLog.findOne({ user: req.user._id, date: dateStr });

      weeklyData.push({
        date: dateStr,
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        tasks: dayTasks.length,
        completed: dayTasks.filter(t => t.status === 'completed').length,
        vocab: dayVocab,
        reading: dayReading ? (dayReading.completed ? 1 : 0) : 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: totalTasks - completedTasks,
          todayTotal: todayTasks,
          todayCompleted: todayCompletedTasks
        },
        vocab: {
          totalWords,
          todayWords,
          todayTarget: 3,
          todayProgress: Math.min(todayWords / 3 * 100, 100)
        },
        reading: {
          totalDays: totalReadingDays,
          todayCompleted: todayReading ? todayReading.completed : false
        },
        streaks: {
          current: streakStats.current,
          longest: streakStats.longest,
          totalCompletedDays
        },
        weeklyData
      }
    });
  } catch (error) {
    next(error);
  }
};
