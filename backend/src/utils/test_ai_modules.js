const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { extractTextFromFile, parseResumeDetails } = require('../services/nlpService');
const { normalizeSkillName, calculateJaccardSimilarity } = require('../services/semanticSkillExtractor');
const connectDB = require('../config/db');

async function testAllModules() {
  console.log('\n=================================================');
  console.log('  TESTING SKILLGAP AI MODULAR SERVICES & NLP LAYER');
  console.log('=================================================\n');

  try {
    // 0. Connect DB
    await connectDB();

    // 1. Test Semantic Skill Extractor
    console.log('--- 1. Testing Semantic Skill Extractor & Taxonomy ---');
    console.log('Normalized "reactjs":', normalizeSkillName('reactjs'));
    console.log('Normalized "nodejs":', normalizeSkillName('nodejs'));
    const sim = calculateJaccardSimilarity(['React JS', 'Node JS', 'MongoDB'], ['React JS', 'JavaScript', 'Spring Boot']);
    console.log('Jaccard Similarity Score:', sim.toFixed(2));
    console.log('PASSED!\n');

    // 2. Test Resume Parser on actual resume file on Desktop
    console.log('--- 2. Testing NLP Resume Parser ---');
    const resumePath = `C:\\Users\\Keerthi Yabaluri\\OneDrive\\Desktop\\krs44.pdf`;
    const text = await extractTextFromFile(resumePath);
    console.log(`Extracted raw text length: ${text.length} chars`);

    const parsed = await parseResumeDetails(text);
    console.log('Extracted Skills Count:', parsed.extractedSkills.length);
    console.log('Extracted Education Lines:', parsed.education);
    console.log('Extracted Certifications:', parsed.certifications);
    console.log('Calculated Experience Years:', parsed.experienceYears);
    console.log('Extracted Contact Info:', parsed.contactInfo);
    console.log('PASSED!\n');

    console.log('=================================================');
    console.log('  ALL AI/NLP SERVICES TESTED SUCCESSFULLY!      ');
    console.log('=================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('TESTING FAILED:', error);
    process.exit(1);
  }
}

testAllModules();
