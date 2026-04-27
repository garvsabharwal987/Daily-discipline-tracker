const Task = require('../models/Task');
const { normalizeDate, getTodayDate } = require('../utils/helpers');

// @desc    Get tasks for a specific date
// @route   GET /api/tasks?date=YYYY-MM-DD
exports.getTasks = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDate();
    const tasks = await Task.find({ user: req.user._id, date })
      .sort({ order: 1, createdAt: 1 });
    
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, date, reminderTime, isRecurring, recurringPattern } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const taskDate = date || getTodayDate();

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      priority: priority || 'medium',
      date: taskDate,
      reminderTime: reminderTime || null,
      isRecurring: isRecurring || false,
      recurringPattern: recurringPattern || null
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Ensure user owns task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Handle status change
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    } else if (req.body.status === 'pending') {
      req.body.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks summary (for streak calculation)
// @route   GET /api/tasks/summary
exports.getTasksSummary = async (req, res, next) => {
  try {
    const summary = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: {
        _id: '$date',
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }},
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};
