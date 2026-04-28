const User = require('../models/User');

// @desc    Update user nickname
// @route   PATCH /api/users/update-nickname
exports.updateNickname = async (req, res, next) => {
  try {
    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({ success: false, message: 'Please provide a nickname' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nickname },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
