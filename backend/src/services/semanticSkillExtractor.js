/**
 * Modular Semantic Skill Extractor Service
 * Rule-based & Taxonomy-driven semantic skill matching
 */

const skillAliasMap = {
  react: 'React JS',
  reactjs: 'React JS',
  'react.js': 'React JS',
  node: 'Node JS',
  nodejs: 'Node JS',
  'node.js': 'Node JS',
  express: 'Express JS',
  expressjs: 'Express JS',
  js: 'JavaScript',
  javascript: 'JavaScript',
  py: 'Python',
  python3: 'Python',
  java8: 'Java',
  java11: 'Java',
  springboot: 'Spring Boot',
  'spring-boot': 'Spring Boot',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  docker: 'Docker',
  containerization: 'Docker',
  aws: 'AWS',
  'amazon-web-services': 'AWS',
};

/**
 * Normalize skill string using taxonomy alias mapping
 */
const normalizeSkillName = (skillName) => {
  if (!skillName) return '';
  const clean = skillName.trim().toLowerCase();
  return skillAliasMap[clean] || skillName.trim();
};

/**
 * Calculate Jaccard Semantic Similarity between candidate skills and required skills
 */
const calculateJaccardSimilarity = (userSkills, requiredSkills) => {
  const setA = new Set(userSkills.map((s) => normalizeSkillName(s).toLowerCase()));
  const setB = new Set(requiredSkills.map((s) => normalizeSkillName(s).toLowerCase()));

  if (setB.size === 0) return 1.0;

  let intersectionCount = 0;
  setB.forEach((val) => {
    if (setA.has(val)) intersectionCount++;
  });

  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount > 0 ? intersectionCount / unionCount : 0;
};

/**
 * Group skills by industry taxonomy category
 */
const categorizeSkills = (skillsList) => {
  const categories = {
    Frontend: [],
    Backend: [],
    Database: [],
    'Cloud/DevOps': [],
    Programming: [],
    'Soft Skill': [],
    Other: [],
  };

  skillsList.forEach((s) => {
    const cat = s.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(s);
  });

  return categories;
};

module.exports = {
  normalizeSkillName,
  calculateJaccardSimilarity,
  categorizeSkills,
};
