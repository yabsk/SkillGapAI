const CareerRoadmap = require('../models/CareerRoadmap');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const User = require('../models/User');
const { generateRoadmap } = require('../services/roadmapService');

// @desc    Generate personalized career roadmap
// @route   POST /api/roadmap/generate
// @access  Private
const createRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.targetRole) {
      return res.status(400).json({ success: false, error: 'Please select a target job role first' });
    }

    const analysis = await SkillGapAnalysis.findOne({ user: req.user._id, jobRole: user.targetRole });
    if (!analysis) {
      return res.status(400).json({ success: false, error: 'Please run skill gap analysis first' });
    }

    const roadmap = await generateRoadmap(req.user._id, analysis._id);

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user's career roadmap
// @route   GET /api/roadmap
// @access  Private
const getMyRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.targetRole) {
      return res.status(200).json({ success: true, data: null });
    }

    const roadmap = await CareerRoadmap.findOne({ user: req.user._id, targetRole: user.targetRole })
      .populate('targetRole')
      .populate('milestones.skill')
      .populate('milestones.resources')
      .populate('milestones.projects');

    res.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update milestone status (Pending -> In Progress -> Completed)
// @route   PATCH /api/roadmap/milestone/:skillId
// @access  Private
const updateMilestoneStatus = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { status } = req.body; // 'Pending' | 'In Progress' | 'Completed'

    const user = await User.findById(req.user._id);
    const roadmap = await CareerRoadmap.findOne({ user: req.user._id, targetRole: user.targetRole });

    if (!roadmap) {
      return res.status(404).json({ success: false, error: 'Roadmap not found' });
    }

    const milestone = roadmap.milestones.find((m) => m.skill.toString() === skillId);
    if (!milestone) {
      return res.status(404).json({ success: false, error: 'Milestone for this skill not found in roadmap' });
    }

    milestone.status = status || 'Completed';

    // Recalculate overall progress
    const total = roadmap.milestones.length;
    const completed = roadmap.milestones.filter((m) => m.status === 'Completed').length;
    roadmap.overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    await roadmap.save();

    const updatedRoadmap = await CareerRoadmap.findById(roadmap._id)
      .populate('targetRole')
      .populate('milestones.skill')
      .populate('milestones.resources')
      .populate('milestones.projects');

    res.json({
      success: true,
      data: updatedRoadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createRoadmap,
  getMyRoadmap,
  updateMilestoneStatus,
};
