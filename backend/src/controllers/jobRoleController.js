const mongoose = require('mongoose');
const JobRole = require('../models/JobRole');
const User = require('../models/User');
const connectDB = require('../config/db');

// @desc    Get all available job roles
// @route   GET /api/job-roles
// @access  Public
const getJobRoles = async (req, res) => {
  try {
    let jobRoles = await JobRole.find().populate('requiredSkills.skill');
    // If database is empty, auto-seed immediately and reload
    if (!jobRoles || jobRoles.length === 0) {
      if (typeof connectDB.runInlineSeed === 'function') {
        console.log('[JobRole Controller] Database has 0 job roles. Triggering auto-seed...');
        await connectDB.runInlineSeed();
        jobRoles = await JobRole.find().populate('requiredSkills.skill');
      }
    }
    res.json({
      success: true,
      data: jobRoles || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single job role by ID or Title
// @route   GET /api/job-roles/:id
// @access  Public
const getJobRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    let jobRole = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      jobRole = await JobRole.findById(id).populate('requiredSkills.skill');
    }
    if (!jobRole) {
      const cleanTitle = id.replace(/-/g, ' ');
      jobRole = await JobRole.findOne({
        title: { $regex: new RegExp(`^${cleanTitle}$`, 'i') },
      }).populate('requiredSkills.skill');
    }
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
    const { roleId, roleTitle } = req.body;
    let jobRole = null;

    // 1. Try finding by MongoDB ObjectId
    if (roleId && mongoose.Types.ObjectId.isValid(roleId)) {
      jobRole = await JobRole.findById(roleId);
    }

    // 2. Try finding by title or slug
    const searchTarget = roleTitle || roleId;
    if (!jobRole && searchTarget) {
      const cleanTarget = String(searchTarget).replace(/-/g, ' ').trim();
      jobRole = await JobRole.findOne({
        title: { $regex: new RegExp(`^${cleanTarget}$`, 'i') },
      });
    }

    // 3. If still not found, check if DB needs seeding
    if (!jobRole && typeof connectDB.runInlineSeed === 'function') {
      await connectDB.runInlineSeed();
      if (roleId && mongoose.Types.ObjectId.isValid(roleId)) {
        jobRole = await JobRole.findById(roleId);
      }
      if (!jobRole && searchTarget) {
        const cleanTarget = String(searchTarget).replace(/-/g, ' ').trim();
        jobRole = await JobRole.findOne({
          title: { $regex: new RegExp(`^${cleanTarget}$`, 'i') },
        });
      }
    }

    // 4. Default fallback: first available job role in database
    if (!jobRole) {
      jobRole = await JobRole.findOne();
    }

    if (!jobRole) {
      return res.status(404).json({ success: false, error: 'No job roles available to select' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { targetRole: jobRole._id },
      { new: true }
    ).populate('targetRole');

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
