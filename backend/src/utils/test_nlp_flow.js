const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');
const { uploadResume, getMyResume } = require('../controllers/resumeController');
const { extractTextFromFile, parseResumeDetails, extractSkillsAndExperience } = require('../services/nlpService');

async function testNLP() {
  await connectDB();

  console.log('\n--- TESTING NLP SERVICE EXPORTS ---');
  console.log('typeof extractTextFromFile:', typeof extractTextFromFile);
  console.log('typeof parseResumeDetails:', typeof parseResumeDetails);
  console.log('typeof extractSkillsAndExperience:', typeof extractSkillsAndExperience);

  const sampleText = `
    Keerthi Sri Yabaluri
    Email: keerthi@gmail.com
    Phone: (555) 123-4567

    SUMMARY:
    Full Stack Developer with 3+ years of experience building web applications using React JS, Node JS, Express JS, and MongoDB.

    SKILLS:
    Java, Python, JavaScript, HTML5, CSS3, REST APIs, Git, SQL, Docker, AWS.

    EDUCATION:
    B.Tech in Computer Science Engineering - Anurag University, CGPA: 8.9

    PROJECTS:
    - TaskFlow App | Built full-stack REST API with Express and MongoDB.
    - Portfolio Website | Developed responsive UI using React and Vite.

    CERTIFICATIONS:
    Infosys Springboard Certified Java Developer
  `;

  console.log('\n--- TESTING NLP PARSING FUNCTION ---');
  const details = await extractSkillsAndExperience(sampleText);
  console.log('Extracted Skills Count:', details.extractedSkills.length);
  console.log('Experience Years:', details.experienceYears);
  console.log('Education:', details.education);
  console.log('Certifications:', details.certifications);
  console.log('Projects:', details.projects);

  if (typeof extractSkillsAndExperience === 'function' && details.extractedSkills.length > 0) {
    console.log('\n✓ PASSED: NLP Extraction Functionality Works Successfully!');
  } else {
    console.error('\n❌ FAILED: NLP Extraction failed.');
  }

  process.exit(0);
}

testNLP();
