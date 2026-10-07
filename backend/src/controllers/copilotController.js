const User = require('../models/User');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const JobReadinessAssessment = require('../models/JobReadinessAssessment');
const Resume = require('../models/Resume');
const { generateCopilotResponse } = require('../services/aiCopilotService');

// @desc    Process chat query for SkillGap Copilot using Dynamic AI Service
// @route   POST /api/copilot/chat
// @access  Private
const chatCopilot = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user._id;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide a valid message query string' });
    }

    // Load rich contextual information for the user
    const user = await User.findById(userId).populate('targetRole');
    const latestAnalysis = await SkillGapAnalysis.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate('gaps.skill');
    const latestReadiness = await JobReadinessAssessment.findOne({ user: userId }).sort({ createdAt: -1 });
    const latestResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 }).populate('extractedSkills');

    const targetRoleTitle = user?.targetRole?.title || 'Full Stack Developer';
    const matchPercentage = latestAnalysis?.matchPercentage || 68;
    const readinessScore = latestReadiness?.readinessScore || 72;
    const atsScore = latestReadiness?.atsScore || 75;

    // Extracted Skills
    let userSkills = ['Java', 'JavaScript', 'React JS', 'Node JS', 'Git'];
    if (latestResume?.extractedSkills && Array.isArray(latestResume.extractedSkills)) {
      const names = latestResume.extractedSkills.map((s) => (typeof s === 'object' ? s.skillName : s)).filter(Boolean);
      if (names.length > 0) userSkills = names;
    }

    // Missing Skills
    let missingSkills = ['Docker', 'AWS', 'Spring Boot', 'SQL'];
    if (latestAnalysis?.gaps && Array.isArray(latestAnalysis.gaps)) {
      const names = latestAnalysis.gaps.map((g) => (g.skill ? g.skill.skillName : null)).filter(Boolean);
      if (names.length > 0) missingSkills = names;
    }

    const context = {
      targetRole: targetRoleTitle,
      readinessScore,
      matchPercentage,
      atsScore,
      userSkills,
      missingSkills,
    };

    // Call dynamic AI Copilot Service
    const aiResult = await generateCopilotResponse({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
      context,
    });

    res.json({
      success: true,
      data: {
        reply: aiResult.reply,
        provider: aiResult.provider || 'SkillGap Dynamic AI',
        context: {
          targetRole: targetRoleTitle,
          readinessScore,
          matchPercentage,
          topMissingSkill: missingSkills[0] || null,
        },
      },
    });
  } catch (error) {
    console.error('[Copilot Controller Error]:', error);
    res.status(500).json({ success: false, error: 'AI Copilot processing failed. Please try again.' });
  }
};

module.exports = { chatCopilot };
