const JobRole = require('../models/JobRole');
const User = require('../models/User');

// @desc    Get all available job roles
// @route   GET /api/job-roles
// @access  Public
const getJobRoles = async (req, res) => {
  try {
    const jobRoles = await JobRole.find().populate('requiredSkills.skill');
    res.json({
      success: true,
      data: jobRoles,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single job role by ID
// @route   GET /api/job-roles/:id
// @access  Public
const getJobRoleById = async (req, res) => {
  try {
    const jobRole = await JobRole.findById(req.params.id).populate('requiredSkills.skill');
    if (!jobRole) {
      return res.status(404).json({ success: false, error: 'Job role not found' });
    }
    res.json({
      success: true,
      data: jobRole,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Select target job role for current user
// @route   PUT /api/job-roles/select-target
// @access  Private
const selectTargetRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const jobRole = await JobRole.findById(roleId);
    if (!jobRole) {
      return res.status(404).json({ success: false, error: 'Job role not found' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { targetRole: roleId }, { new: true }).populate(
      'targetRole'
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getJobRoles,
  getJobRoleById,
  selectTargetRole,
};
