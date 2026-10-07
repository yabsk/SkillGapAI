const LearningResource = require('../models/LearningResource');
const ProjectRecommendation = require('../models/ProjectRecommendation');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const User = require('../models/User');

/**
 * Generate modular recommendations tailored to user skill gaps
 */
const getTailoredRecommendations = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.targetRole) {
    return getDefaultRecommendations();
  }

  const analysis = await SkillGapAnalysis.findOne({ user: userId, jobRole: user.targetRole })
    .populate('gaps.skill');

  if (!analysis || !analysis.gaps || analysis.gaps.length === 0) {
    return getDefaultRecommendations();
  }

  const gapSkillIds = analysis.gaps.filter((g) => g.skill).map((g) => g.skill._id);

  // 1. Fetch Courses & Coding Practice Resources from DB
  const resources = await LearningResource.find({ skill: { $in: gapSkillIds } }).populate('skill');

  const courses = [];
  const codingPractices = [];

  resources.forEach((r) => {
    const item = {
      _id: r._id,
      title: r.title,
      type: r.type,
      url: r.url,
      platform: r.platform,
      estimatedHours: r.estimatedHours,
      skillName: r.skill ? r.skill.skillName : 'General',
    };

    if (r.type === 'Course') {
      courses.push(item);
    } else {
      codingPractices.push(item);
    }
  });

  // 2. Fetch Projects from DB
  const projectsFromDb = await ProjectRecommendation.find({ skill: { $in: gapSkillIds } }).populate('skill');
  const projects = projectsFromDb.map((p) => ({
    _id: p._id,
    title: p.title,
    description: p.description,
    difficultyLevel: p.difficultyLevel,
    techStack: p.techStack,
    skillName: p.skill ? p.skill.skillName : 'General',
  }));

  // 3. Generate Certifications dynamically based on gaps
  const certifications = analysis.gaps.slice(0, 5).map((g) => {
    const sName = g.skill ? g.skill.skillName : 'Software Engineering';
    return {
      _id: `cert-${g.skill ? g.skill._id : Math.random()}`,
      title: `${sName} Professional Certification`,
      provider: getCertProvider(sName),
      skillName: sName,
      difficulty: 'Intermediate',
      url: getCertUrl(sName),
    };
  });

  // Fill fallbacks if list is small
  const defaults = getDefaultRecommendations();
  if (courses.length === 0) courses.push(...defaults.courses);
  if (certifications.length === 0) certifications.push(...defaults.certifications);
  if (codingPractices.length === 0) codingPractices.push(...defaults.codingPractices);
  if (projects.length === 0) projects.push(...defaults.projects);

  return {
    courses,
    certifications,
    codingPractices,
    projects,
  };
};

const getCertProvider = (skillName) => {
  const s = skillName.toLowerCase();
  if (s.includes('aws') || s.includes('cloud')) return 'Amazon Web Services (AWS)';
  if (s.includes('java') || s.includes('spring')) return 'Oracle / Infosys Springboard';
  if (s.includes('python')) return 'HackerRank / Coursera';
  if (s.includes('react') || s.includes('javascript')) return 'Meta Frontend Developer';
  if (s.includes('docker') || s.includes('kubernetes')) return 'CNCF Cloud Native';
  return 'Industry Certified Platform';
};

const getCertUrl = (skillName) => {
  const s = skillName.toLowerCase();
  if (s.includes('aws')) return 'https://aws.amazon.com/certification/';
  if (s.includes('java')) return 'https://education.oracle.com/';
  if (s.includes('python')) return 'https://www.hackerrank.com/certificates';
  return 'https://www.coursera.org/professional-certificates';
};

const getDefaultRecommendations = () => ({
  courses: [
    { _id: 'c1', title: 'React JS Official Guide & Hooks', platform: 'React.dev', estimatedHours: 15, skillName: 'React JS', url: 'https://react.dev/learn' },
    { _id: 'c2', title: 'Node.js Express & MongoDB Masterclass', platform: 'Udemy', estimatedHours: 35, skillName: 'Node JS', url: 'https://nodejs.org/' },
  ],
  certifications: [
    { _id: 'cert1', title: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services', skillName: 'AWS', difficulty: 'Foundational', url: 'https://aws.amazon.com/certification/' },
    { _id: 'cert2', title: 'Oracle Certified Professional Java Developer', provider: 'Oracle', skillName: 'Java', difficulty: 'Professional', url: 'https://education.oracle.com/' },
  ],
  codingPractices: [
    { _id: 'p1', title: 'LeetCode 75 Essential DSA Study Plan', platform: 'LeetCode', estimatedHours: 30, skillName: 'DSA / Java', url: 'https://leetcode.com/studyplan/leetcode-75/' },
    { _id: 'p2', title: 'HackerRank Python Skill Certification', platform: 'HackerRank', estimatedHours: 15, skillName: 'Python', url: 'https://www.hackerrank.com/domains/python' },
  ],
  projects: [
    { _id: 'proj1', title: 'LoanCheck - Bank Loan Assessment Engine', description: 'Build a fullstack loan assessment platform.', difficultyLevel: 'Intermediate', techStack: ['React', 'Spring Boot', 'REST APIs'], skillName: 'Full Stack' },
    { _id: 'proj2', title: 'CampusFlow - Event Registration System', description: 'Centralized web dashboard for event discovery.', difficultyLevel: 'Intermediate', techStack: ['React', 'Tailwind', 'Node.js', 'MongoDB'], skillName: 'React JS' },
  ],
});

module.exports = {
  getTailoredRecommendations,
  getDefaultRecommendations,
};
