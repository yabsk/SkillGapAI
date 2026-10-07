const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { analyzeAtsCompatibility } = require('../services/atsCompatibilityService');
const { evaluateResumeQuality } = require('../services/resumeEvaluationService');

// @desc    Get ATS compatibility analysis & formatting score
// @route   GET /api/resume-evaluation/ats
// @access  Private
const getAtsEvaluation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.targetRole) {
      return res.status(400).json({ success: false, error: 'Target role not selected' });
    }

    const analysis = await SkillGapAnalysis.findOne({ user: req.user._id, jobRole: user.targetRole });
    if (!analysis) {
      return res.status(400).json({ success: false, error: 'Please execute skill gap analysis first' });
    }

    const atsResult = await analyzeAtsCompatibility(req.user._id, analysis._id);
    const qualityResult = await evaluateResumeQuality(analysis.resume);

    res.json({
      success: true,
      data: {
        ats: atsResult,
        quality: qualityResult,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAtsEvaluation,
};
