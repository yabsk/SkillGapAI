const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const JobReadinessAssessment = require('../models/JobReadinessAssessment');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { performGapAnalysis } = require('../services/gapAnalysisService');
const { evaluateJobReadiness } = require('../services/readinessService');

// @desc    Run semantic gap analysis and job readiness assessment
// @route   POST /api/analysis/run
// @access  Private
const runAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.targetRole) {
      return res.status(400).json({ success: false, error: 'Please select a target job role first' });
    }

    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      return res.status(400).json({ success: false, error: 'Please upload your resume before running analysis' });
    }

    // 1. Execute Semantic Skill Gap Analysis
    const analysis = await performGapAnalysis(req.user._id, user.targetRole, resume._id);

    // 2. Execute Job Readiness & ATS Assessment
    const readiness = await evaluateJobReadiness(req.user._id, analysis._id);

    const populatedAnalysis = await SkillGapAnalysis.findById(analysis._id)
      .populate('jobRole')
      .populate('matchedSkills')
      .populate('gaps.skill');

    res.status(200).json({
      success: true,
      data: {
        analysis: populatedAnalysis,
        readiness,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get latest gap analysis for current user
// @route   GET /api/analysis/latest
// @access  Private
const getLatestAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.targetRole) {
      return res.status(200).json({ success: true, data: null });
    }

    const analysis = await SkillGapAnalysis.findOne({ user: req.user._id, jobRole: user.targetRole })
      .populate('jobRole')
      .populate('matchedSkills')
      .populate('gaps.skill');

    if (!analysis) {
      return res.status(200).json({ success: true, data: null });
    }

    const readiness = await JobReadinessAssessment.findOne({ analysis: analysis._id });

    res.json({
      success: true,
      data: {
        analysis,
        readiness,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  runAnalysis,
  getLatestAnalysis,
};
