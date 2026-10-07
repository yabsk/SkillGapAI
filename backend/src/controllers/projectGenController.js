const User = require('../models/User');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const JobRole = require('../models/JobRole');

// @desc    Generate personalized project tailored to user skill gaps
// @route   POST /api/projects/generate-custom
// @access  Private
const generateCustomProject = async (req, res) => {
  try {
    const { targetRoleTitle, skillLevel } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).populate('targetRole');
    const latestAnalysis = await SkillGapAnalysis.findOne({ user: userId }).sort({ createdAt: -1 });

    const roleName = targetRoleTitle || user?.targetRole?.title || 'Full Stack Developer';
    const level = skillLevel || 'Intermediate';
    const missingSkills = latestAnalysis?.missingSkills?.map((s) => s.skillName) || ['Docker', 'AWS', 'Spring Boot'];
    const focusSkill = missingSkills[0] || 'Node JS';
    const secondarySkill = missingSkills[1] || 'MongoDB';

    // Build custom project blueprint targeting the user's specific skill gap
    const project = {
      title: `${roleName} - ${focusSkill} & ${secondarySkill} Enterprise Engine`,
      problemStatement: `Developing scalable software for ${roleName} requires practical experience handling production workloads with ${focusSkill} and ${secondarySkill}. This project solves real-world data throughput and deployment containerization challenges.`,
      whyUseful: `Directly bridges your biggest identified skill gap (${focusSkill}) while providing a production-grade portfolio repository to demonstrate to technical interviewers.`,
      technologies: [focusSkill, secondarySkill, 'JavaScript/Node.js', 'REST APIs', 'Git'],
      skillsDeveloped: [focusSkill, secondarySkill, 'System Design', 'API Optimization', 'Error Logging'],
      difficultyLevel: level,
      suggestedFeatures: [
        `Secure JWT authentication and role-based access control for ${roleName} workflows`,
        `Optimized RESTful CRUD endpoints leveraging ${focusSkill} and ${secondarySkill}`,
        `Comprehensive error handling, request logging, and rate limiting`,
        `Automated test suite with unit and integration tests`,
        `Containerized Dockerfile configuration for single-command deployment`,
      ],
      expectedOutcome: `A fully functioning, documented GitHub repository with a live demo link, architecture diagram, and clean codebase demonstrating mastery in ${focusSkill}.`,
      helpsCareer: `Fills the #1 missing requirement on your target ${roleName} job specification, boosting your Job Readiness score and ATS keyword index.`,
      generatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { generateCustomProject };
