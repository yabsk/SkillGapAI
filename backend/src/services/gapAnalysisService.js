const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const JobRole = require('../models/JobRole');
const Resume = require('../models/Resume');
const { normalizeSkillName } = require('./semanticSkillExtractor');

/**
 * Perform semantic gap analysis between user resume skills and target job role
 */
const performGapAnalysis = async (userId, jobRoleId, resumeId) => {
  const jobRole = await JobRole.findById(jobRoleId).populate('requiredSkills.skill');
  const resume = await Resume.findById(resumeId).populate('extractedSkills');

  if (!jobRole || !resume) {
    throw new Error('Job Role or Resume not found for gap analysis');
  }

  // Set of normalized user skill names
  const userSkillNames = new Set(
    resume.extractedSkills.map((s) => normalizeSkillName(s.skillName).toLowerCase())
  );

  const requiredList = jobRole.requiredSkills;

  let totalWeight = 0;
  let matchedWeight = 0;
  const matchedSkills = [];
  const gaps = [];

  for (const req of requiredList) {
    if (!req.skill) continue;
    const normName = normalizeSkillName(req.skill.skillName).toLowerCase();
    const weight = req.priorityWeight || 5;
    totalWeight += weight;

    if (userSkillNames.has(normName)) {
      matchedWeight += weight;
      matchedSkills.push(req.skill._id);
    } else {
      gaps.push({
        skill: req.skill._id,
        gapType: req.isMandatory ? 'Missing' : 'Proficiency Mismatch',
        priorityScore: weight,
      });
    }
  }

  // Sort gaps by priority score descending
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  const matchPercentage = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  // Save or Update Analysis
  let analysis = await SkillGapAnalysis.findOne({ user: userId, jobRole: jobRoleId });
  if (analysis) {
    analysis.resume = resumeId;
    analysis.matchPercentage = matchPercentage;
    analysis.matchedSkills = matchedSkills;
    analysis.gaps = gaps;
    await analysis.save();
  } else {
    analysis = await SkillGapAnalysis.create({
      user: userId,
      jobRole: jobRoleId,
      resume: resumeId,
      matchPercentage,
      matchedSkills,
      gaps,
    });
  }

  return analysis;
};

module.exports = {
  performGapAnalysis,
};
