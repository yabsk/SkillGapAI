const User = require('../models/User');
const Resume = require('../models/Resume');
const JobRole = require('../models/JobRole');
const Skill = require('../models/Skill');
const LearningResource = require('../models/LearningResource');
const ProjectRecommendation = require('../models/ProjectRecommendation');
const JobReadinessAssessment = require('../models/JobReadinessAssessment');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalResumes = await Resume.countDocuments();
    const totalRoles = await JobRole.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalResources = await LearningResource.countDocuments();
    const totalProjects = await ProjectRecommendation.countDocuments();

    // Calculate Average Readiness Score
    const assessments = await JobReadinessAssessment.find();
    let avgReadinessScore = 0;
    if (assessments.length > 0) {
      const sum = assessments.reduce((acc, curr) => acc + curr.readinessScore, 0);
      avgReadinessScore = Math.round(sum / assessments.length);
    }

    res.json({
      success: true,
      data: {
        totalUsers,
        totalResumes,
        totalRoles,
        totalSkills,
        totalResources,
        totalProjects,
        avgReadinessScore,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a Master Skill
// @route   POST /api/admin/skills
// @access  Private (Admin Only)
const createSkill = async (req, res) => {
  try {
    const { skillName, category, description } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, error: 'Skill name is required' });
    }

    const skill = await Skill.create({
      skillName,
      category,
      description,
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a Job Role
// @route   POST /api/admin/job-roles
// @access  Private (Admin Only)
const createJobRole = async (req, res) => {
  try {
    const { title, industryCategory, description, requiredSkills } = req.body;
    if (!title || !industryCategory) {
      return res.status(400).json({ success: false, error: 'Title and Industry Category are required' });
    }

    const jobRole = await JobRole.create({
      title,
      industryCategory,
      description,
      requiredSkills: requiredSkills || [],
    });

    res.status(201).json({ success: true, data: jobRole });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a Learning Resource
// @route   POST /api/admin/resources
// @access  Private (Admin Only)
const createResource = async (req, res) => {
  try {
    const { skill, title, type, url, platform, estimatedHours } = req.body;
    if (!skill || !title || !url) {
      return res.status(400).json({ success: false, error: 'Skill, Title, and URL are required' });
    }

    const resource = await LearningResource.create({
      skill,
      title,
      type,
      url,
      platform,
      estimatedHours,
    });

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a Project Recommendation
// @route   POST /api/admin/projects
// @access  Private (Admin Only)
const createProject = async (req, res) => {
  try {
    const { skill, title, description, difficultyLevel, techStack } = req.body;
    if (!skill || !title) {
      return res.status(400).json({ success: false, error: 'Skill and Title are required' });
    }

    const project = await ProjectRecommendation.create({
      skill,
      title,
      description,
      difficultyLevel,
      techStack: techStack || [],
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAdminStats,
  createSkill,
  createJobRole,
  createResource,
  createProject,
};
