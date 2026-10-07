const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const JobRole = require('../models/JobRole');
const Resume = require('../models/Resume');
const { normalizeSkillName } = require('./semanticSkillExtractor');

/**
 * Perform rule-based ATS Compatibility Analysis
 */
const analyzeAtsCompatibility = async (userId, analysisId) => {
  const analysis = await SkillGapAnalysis.findById(analysisId)
    .populate('jobRole')
    .populate('matchedSkills')
    .populate('gaps.skill');

  if (!analysis) {
    throw new Error('Skill gap analysis record not found for ATS evaluation');
  }

  const resume = await Resume.findById(analysis.resume);
  const matchPct = analysis.matchPercentage;
  const rawText = resume ? resume.parsedText.toLowerCase() : '';

  // Calculate ATS Pass Probability Score
  const atsScore = Math.min(Math.round(matchPct * 0.85 + 15), 100);

  // Identify missing ATS keywords
  const missingKeywords = analysis.gaps
    .filter((g) => g.skill)
    .map((g) => g.skill.skillName);

  // Formatting compliance checks
  const formattingChecks = {
    standardFont: true,
    noGraphics: !rawText.includes('<img') && !rawText.includes('<svg'),
    parseableText: rawText.length > 100,
    hasQuantifiableMetrics: /\d+%/i.test(rawText) || /\d+\+/i.test(rawText) || /reduced|increased|improved|developed/i.test(rawText),
  };

  const actionChecklist = [
    `Include missing target keywords in your Summary and Skills sections: ${missingKeywords.slice(0, 5).join(', ')}.`,
    'Use standard bullet points with action verbs (e.g. "Developed", "Architected", "Engineered").',
    'Keep section headings standard (e.g., "SKILLS", "EDUCATION", "PROJECTS") for automated parser recognition.',
    'Avoid placing core technical skills inside embedded tables or images.',
  ];

  return {
    atsScore,
    matchPercentage: matchPct,
    missingKeywords,
    formattingChecks,
    actionChecklist,
  };
};

module.exports = {
  analyzeAtsCompatibility,
};
