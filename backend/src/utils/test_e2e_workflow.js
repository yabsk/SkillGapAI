const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const JobRole = require('../models/JobRole');
const Resume = require('../models/Resume');
const { extractTextFromFile, parseResumeDetails } = require('../services/nlpService');
const { performGapAnalysis } = require('../services/gapAnalysisService');
const { generateRoadmap } = require('../services/roadmapService');
const { getTailoredRecommendations } = require('../services/recommendationService');
const { analyzeAtsCompatibility } = require('../services/atsCompatibilityService');
const { evaluateJobReadiness } = require('../services/readinessService');

async function testFullWorkflow() {
  console.log('\n=================================================');
  console.log('  TESTING SKILLGAP AI COMPLETE E2E INTEGRATION   ');
  console.log('=================================================\n');

  try {
    // 1. Connect DB
    await connectDB();

    // 2. Auth / User Profile Step
    console.log('Step 1 & 2: Authenticating Demo User & Fetching Profile...');
    let user = await User.findOne({ email: 'keerthi@gmail.com' });
    if (!user) {
      user = await User.create({
        name: 'Keerthi Sri',
        email: 'keerthi@gmail.com',
        password: 'userpassword123',
        role: 'user',
      });
    }
    console.log(`User Logged In: ${user.name} (${user.email})`);

    // 3. Upload & Parse Resume
    console.log('\nStep 3 & 4: Uploading & Parsing Resume (krs44.pdf)...');
    const resumePath = `C:\\Users\\Keerthi Yabaluri\\OneDrive\\Desktop\\krs44.pdf`;
    const parsedText = await extractTextFromFile(resumePath);
    const { extractedSkills, experienceYears } = await parseResumeDetails(parsedText);

    let resume = await Resume.findOne({ user: user._id });
    if (resume) {
      resume.rawFilePath = resumePath;
      resume.parsedText = parsedText;
      resume.extractedSkills = extractedSkills;
      resume.experienceYears = experienceYears;
      await resume.save();
    } else {
      resume = await Resume.create({
        user: user._id,
        rawFilePath: resumePath,
        fileName: 'krs44.pdf',
        parsedText,
        extractedSkills,
        experienceYears,
      });
    }
    console.log(`Resume Parsed! Extracted ${extractedSkills.length} skills, ${experienceYears} Yrs Experience.`);

    // 4. Select Target Role
    console.log('\nStep 5 & 6: Retrieving Job Roles & Selecting Target Role...');
    const targetRole = await JobRole.findOne({ title: 'Full Stack Developer' });
    user.targetRole = targetRole._id;
    await user.save();
    console.log(`Target Role Selected: ${targetRole.title} (${targetRole.industryCategory})`);

    // 5. Run Semantic Skill Gap Analysis
    console.log('\nStep 7 & 8: Executing Semantic Skill Gap Analysis...');
    const analysis = await performGapAnalysis(user._id, targetRole._id, resume._id);
    console.log(`Skill Gap Analysis Complete! Match Percentage: ${analysis.matchPercentage}%`);
    console.log(`Matched Skills: ${analysis.matchedSkills.length}, Identified Gaps: ${analysis.gaps.length}`);

    // 6. Generate Personalized Career Roadmap
    console.log('\nStep 9: Generating Personalized Career Roadmap...');
    const roadmap = await generateRoadmap(user._id, analysis._id);
    console.log(`Career Roadmap Generated! Milestones Count: ${roadmap.milestones.length}`);

    // 7. Recommendations Engine
    console.log('\nStep 10: Generating Targeted Recommendations...');
    const recs = await getTailoredRecommendations(user._id);
    console.log(`Courses Recommended: ${recs.courses.length}`);
    console.log(`Certifications Recommended: ${recs.certifications.length}`);
    console.log(`Coding Practice Recommended: ${recs.codingPractices.length}`);
    console.log(`Projects Recommended: ${recs.projects.length}`);

    // 8. Resume Evaluation & ATS Compatibility
    console.log('\nStep 11 & 12: Evaluating ATS Compatibility & Formatting...');
    const ats = await analyzeAtsCompatibility(user._id, analysis._id);
    console.log(`ATS Compatibility Pass Score: ${ats.atsScore}%`);
    console.log(`Missing ATS Keywords: ${ats.missingKeywords.join(', ')}`);

    // 9. Job Readiness Score & Contributing Factors
    console.log('\nStep 13: Calculating Job Readiness Score & Factors...');
    const readiness = await evaluateJobReadiness(user._id, analysis._id);
    console.log(`Composite Job Readiness Score: ${readiness.readinessScore}%`);
    console.log(`Contributing Factors:`, readiness.contributingFactors);

    console.log('\n=================================================');
    console.log('  COMPLETE END-TO-END WORKFLOW TEST PASSED 100%!  ');
    console.log('=================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('E2E TEST FAILED:', error);
    process.exit(1);
  }
}

testFullWorkflow();
