const Resume = require('../models/Resume');

/**
 * Evaluate resume quality, formatting, and structural completeness
 */
const evaluateResumeQuality = async (resumeId) => {
  const resume = await Resume.findById(resumeId).populate('extractedSkills');
  if (!resume || !resume.parsedText) {
    return {
      qualityScore: 50,
      rating: 'Needs Improvement',
      sectionChecks: {
        hasSkillsSection: false,
        hasEducationSection: false,
        hasProjectsSection: false,
        hasContactInfo: false,
      },
      recommendations: ['Upload a valid resume document (PDF or DOCX).'],
    };
  }

  const text = resume.parsedText.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  const sectionChecks = {
    hasSkillsSection: text.includes('skill') || text.includes('technolog'),
    hasEducationSection: text.includes('education') || text.includes('btech') || text.includes('university') || text.includes('college'),
    hasProjectsSection: text.includes('project') || text.includes('developed') || text.includes('built'),
    hasContactInfo: text.includes('@') || text.match(/\d{10}/),
    hasCertifications: text.includes('certif') || text.includes('course'),
  };

  let points = 40; // Base score
  if (sectionChecks.hasSkillsSection) points += 15;
  if (sectionChecks.hasEducationSection) points += 15;
  if (sectionChecks.hasProjectsSection) points += 15;
  if (sectionChecks.hasContactInfo) points += 10;
  if (sectionChecks.hasCertifications) points += 5;

  // Length check (ideal resume: 200 - 1000 words)
  if (wordCount >= 200 && wordCount <= 1000) {
    points += 10;
  }

  const qualityScore = Math.min(points, 100);
  let rating = 'Needs Work';
  if (qualityScore >= 85) rating = 'Excellent';
  else if (qualityScore >= 70) rating = 'Good';
  else if (qualityScore >= 55) rating = 'Fair';

  const recommendations = [];
  if (!sectionChecks.hasSkillsSection) recommendations.push('Add a clearly titled SKILLS section to highlight technical proficiencies.');
  if (!sectionChecks.hasProjectsSection) recommendations.push('Add a TECHNICAL PROJECTS section with bullet points showing achievements.');
  if (!sectionChecks.hasCertifications) recommendations.push('Include certified courses (e.g. Cisco, NPTEL, Coursera, Infosys) to boost credibility.');
  if (wordCount < 150) recommendations.push('Expand your project descriptions and work experience details to improve length rating.');

  return {
    qualityScore,
    rating,
    wordCount,
    sectionChecks,
    recommendations,
  };
};

module.exports = {
  evaluateResumeQuality,
};
