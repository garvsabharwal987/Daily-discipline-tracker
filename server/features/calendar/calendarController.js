const Task = require('../../models/Task');

// @desc    Get monthly task summary
// @route   GET /api/calendar/month
exports.getMonthSummary = async (req, res, next) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'Please provide year and month' });
    }

    const paddedMonth = month.padStart(2, '0');
    const datePrefix = `${year}-${paddedMonth}`;

    const summary = await Task.aggregate([
      { 
        $match: { 
          user: req.user._id,
          date: { $regex: `^${datePrefix}` } 
        } 
      },
      { 
        $group: {
          _id: '$date',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
          completed: 1,
          allDone: { $eq: ['$total', '$completed'] }
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};
