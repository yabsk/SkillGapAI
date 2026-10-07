const CareerRoadmap = require('../models/CareerRoadmap');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const LearningResource = require('../models/LearningResource');
const ProjectRecommendation = require('../models/ProjectRecommendation');

/**
 * Generate dynamic career roadmap based on gap analysis
 */
const generateRoadmap = async (userId, analysisId) => {
  const analysis = await SkillGapAnalysis.findById(analysisId)
    .populate('gaps.skill')
    .populate('jobRole');

  if (!analysis) {
    throw new Error('Skill gap analysis not found');
  }

  const milestones = [];

  for (const gap of analysis.gaps) {
    if (!gap.skill) continue;
    const skillId = gap.skill._id;

    const resources = await LearningResource.find({ skill: skillId });
    const projects = await ProjectRecommendation.find({ skill: skillId });

    milestones.push({
      skill: skillId,
      status: 'Pending',
      resources: resources.map((r) => r._id),
      projects: projects.map((p) => p._id),
    });
  }

  let roadmap = await CareerRoadmap.findOne({ user: userId, targetRole: analysis.jobRole._id });
  if (roadmap) {
    roadmap.milestones = milestones;
    roadmap.overallProgress = 0;
    roadmap.creationDate = Date.now();
    await roadmap.save();
  } else {
    roadmap = await CareerRoadmap.create({
      user: userId,
      targetRole: analysis.jobRole._id,
      overallProgress: 0,
      milestones,
    });
  }

  return await CareerRoadmap.findById(roadmap._id)
    .populate('targetRole')
    .populate('milestones.skill')
    .populate('milestones.resources')
    .populate('milestones.projects');
};

module.exports = {
  generateRoadmap,
};
