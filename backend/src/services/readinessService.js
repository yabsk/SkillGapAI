const JobReadinessAssessment = require('../models/JobReadinessAssessment');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const Resume = require('../models/Resume');
const { evaluateResumeQuality } = require('./resumeEvaluationService');
const { analyzeAtsCompatibility } = require('./atsCompatibilityService');

/**
 * Calculate composite Job Readiness Score and return contributing factors
 */
const evaluateJobReadiness = async (userId, analysisId) => {
  const analysis = await SkillGapAnalysis.findById(analysisId)
    .populate('matchedSkills')
    .populate('gaps.skill')
    .populate('jobRole');

  if (!analysis) {
    throw new Error('Analysis record not found for readiness evaluation');
  }

  const resume = await Resume.findById(analysis.resume);
  const matchPct = analysis.matchPercentage;
  const experienceYears = resume ? resume.experienceYears : 0;

  // 1. Get ATS Compatibility & Resume Quality scores
  const atsResult = await analyzeAtsCompatibility(userId, analysisId);
  const qualityResult = await evaluateResumeQuality(analysis.resume);

  // 2. Composite Job Readiness Score Calculation
  // Formula: 50% Skill Match + 25% ATS Score + 15% Resume Quality + 10% Experience Fit
  const expFactor = Math.min(experienceYears * 5, 10);
  const readinessScore = Math.min(
    Math.round(
      matchPct * 0.5 +
      atsResult.atsScore * 0.25 +
      qualityResult.qualityScore * 0.15 +
      expFactor
    ),
    100
  );

  // 3. Derive Contributing Factors (Strengths, Weak Areas, Key Action Items)
  const strengths = analysis.matchedSkills.map((s) => `Proficient in ${s.skillName} (${s.category})`);
  if (experienceYears > 0) {
    strengths.push(`${experienceYears} Year(s) of verified industry/project experience`);
  }
  if (qualityResult.qualityScore >= 75) {
    strengths.push('High structural resume formatting quality');
  }

  const weakAreas = analysis.gaps.map(
    (g) => `Missing skill: ${g.skill ? g.skill.skillName : 'Required Skill'} (Priority Score: ${g.priorityScore}/10)`
  );

  const missingKeywords = atsResult.missingKeywords;
  const atsSuggestions = atsResult.actionChecklist;

  let assessment = await JobReadinessAssessment.findOne({ analysis: analysisId });
  if (assessment) {
    assessment.readinessScore = readinessScore;
    assessment.strengths = strengths;
    assessment.weakAreas = weakAreas;
    assessment.atsSuggestions = atsSuggestions;
    assessment.missingKeywords = missingKeywords;
    assessment.evaluationDate = Date.now();
    await assessment.save();
  } else {
    assessment = await JobReadinessAssessment.create({
      analysis: analysisId,
      user: userId,
      readinessScore,
      strengths,
      weakAreas,
      atsSuggestions,
      missingKeywords,
    });
  }

  return {
    assessment,
    readinessScore,
    contributingFactors: {
      skillMatchScore: matchPct,
      atsCompatibilityScore: atsResult.atsScore,
      resumeQualityScore: qualityResult.qualityScore,
      experienceBonus: expFactor,
    },
    strengths,
    weakAreas,
    missingKeywords,
    atsSuggestions,
  };
};

module.exports = {
  evaluateJobReadiness,
};
