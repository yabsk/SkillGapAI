const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const User = require('../models/User');
const { evaluateJobReadiness } = require('../services/readinessService');

// @desc    Get Job Readiness Score & Contributing Factors
// @route   GET /api/readiness
// @access  Private
const getReadinessScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.targetRole) {
      return res.status(400).json({ success: false, error: 'Target role not selected' });
    }

    const analysis = await SkillGapAnalysis.findOne({ user: req.user._id, jobRole: user.targetRole });
    if (!analysis) {
      return res.status(400).json({ success: false, error: 'Please execute skill gap analysis first' });
    }

    const readiness = await evaluateJobReadiness(req.user._id, analysis._id);

    res.json({
      success: true,
      data: readiness,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getReadinessScore,
};
