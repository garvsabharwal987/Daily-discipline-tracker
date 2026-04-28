const gamificationService = require('./gamificationService');

// @desc    Get user gamification stats
// @route   GET /api/gamification/stats
exports.getStats = async (req, res, next) => {
  try {
    const stats = await gamificationService.getStats(req.user._id);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/gamification/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    // This could also be in social, but XP is gamification
    const User = require('../../models/User');
    const topUsers = await User.find({})
      .sort({ 'gamification.xp': -1 })
      .limit(10)
      .select('name gamification.xp gamification.level');

    res.status(200).json({
      success: true,
      data: topUsers
    });
  } catch (error) {
    next(error);
  }
};
