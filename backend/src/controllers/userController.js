const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('targetRole');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, targetRole } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (name) user.name = name;
    if (targetRole) user.targetRole = targetRole;

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password').populate('targetRole');

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
