const User = require('../models/User');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const Resume = require('../models/Resume');
const {
  generateInterviewSessionQuestions,
  evaluateInterviewAnswer,
  generateFinalInterviewReport,
} = require('../services/aiInterviewService');

// @desc    Generate personalized 13 multi-round interview questions
// @route   POST /api/interview/generate-questions
// @access  Private
const generateQuestions = async (req, res) => {
  try {
    const { roleTitle, experienceLevel, interviewType } = req.body;
    const userId = req.user._id;

    // Fetch user context
    const user = await User.findById(userId).populate('targetRole');
    const latestAnalysis = await SkillGapAnalysis.findOne({ user: userId }).sort({ createdAt: -1 });
    const latestResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });

    const role = roleTitle || user?.targetRole?.title || 'Full Stack Developer';
    const level = experienceLevel || 'Mid-Level';

    const userSkills = (user?.skills && user.skills.length > 0)
      ? user.skills.map((s) => s.skillName)
      : (latestResume?.extractedSkills || ['JavaScript', 'React', 'Node.js']);
    
    const missingSkills = (latestAnalysis?.missingSkills && latestAnalysis.missingSkills.length > 0)
      ? latestAnalysis.missingSkills.map((s) => s.skillName)
      : ['Docker', 'AWS', 'Spring Boot'];

    const resumeProjects = (latestResume?.projects && latestResume.projects.length > 0)
      ? latestResume.projects.map((p) => typeof p === 'string' ? p : p.title || 'Technical Project')
      : ['Full Stack E-Commerce App', 'REST API Gateway'];

    const userContext = {
      targetRole: role,
      userSkills,
      missingSkills,
      resumeProjects,
      readinessScore: latestAnalysis?.readinessScore || 75,
    };

    const questions = await generateInterviewSessionQuestions({
      roleTitle: role,
      experienceLevel: level,
      interviewType: interviewType || 'Technical & System Design',
      userContext,
    });

    res.json({
      success: true,
      data: {
        role,
        experienceLevel: level,
        interviewType: interviewType || 'Technical & System Design',
        totalQuestions: questions.length,
        questions,
      },
    });
  } catch (error) {
    console.error('generateQuestions Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Evaluate user interview answer and provide feedback + optional follow-up
// @route   POST /api/interview/evaluate-answer
// @access  Private
const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, question, userAnswer, targetSkill, roundName, roleTitle, experienceLevel } = req.body;

    if (!userAnswer || userAnswer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a non-empty answer to receive evaluation.',
      });
    }

    const evaluation = await evaluateInterviewAnswer({
      roleTitle: roleTitle || 'Full Stack Developer',
      experienceLevel: experienceLevel || 'Mid-Level',
      question,
      userAnswer,
      targetSkill: targetSkill || 'Core Concepts',
      roundName: roundName || 'Technical Knowledge',
    });

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('evaluateAnswer Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Generate final interview performance report
// @route   POST /api/interview/generate-report
// @access  Private
const generateReport = async (req, res) => {
  try {
    const { roleTitle, experienceLevel, QnAList } = req.body;
    const userId = req.user._id;

    const latestAnalysis = await SkillGapAnalysis.findOne({ user: userId }).sort({ createdAt: -1 });
    const missingSkills = latestAnalysis?.missingSkills?.map((s) => s.skillName) || ['Docker', 'AWS', 'Spring Boot'];

    const report = await generateFinalInterviewReport({
      roleTitle: roleTitle || 'Full Stack Developer',
      experienceLevel: experienceLevel || 'Mid-Level',
      QnAList: QnAList || [],
      userContext: { missingSkills },
    });

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('generateReport Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { generateQuestions, evaluateAnswer, generateReport };
