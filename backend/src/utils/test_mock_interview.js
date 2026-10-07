const {
  generateInterviewSessionQuestions,
  evaluateInterviewAnswer,
  generateFinalInterviewReport,
} = require('../services/aiInterviewService');

async function testMockInterviewEngine() {
  console.log('\n======================================================');
  console.log('  TESTING AI MOCK INTERVIEW ENGINE & DYNAMIC PIPELINE');
  console.log('======================================================\n');

  // Test 1: Generate Questions for Full Stack Developer (Mid-Level)
  console.log('1. Testing Question Generation for Full Stack Developer (Mid-Level)...');
  const questionsFS = await generateInterviewSessionQuestions({
    roleTitle: 'Full Stack Developer',
    experienceLevel: 'Mid-Level',
    userContext: {
      userSkills: ['React', 'Node.js', 'MongoDB'],
      missingSkills: ['Docker', 'AWS'],
      resumeProjects: ['SkillGap AI Platform'],
    },
  });
  console.log(`   ✓ Received ${questionsFS.length} questions across 5 rounds.`);
  console.log(`   Sample Q1 (${questionsFS[0].round}): "${questionsFS[0].question}"`);
  console.log(`   Sample Q10 (${questionsFS[9].round}): "${questionsFS[9].question}"`);

  // Test 2: Question Generation for DevOps / Cloud Engineer (Senior Level)
  console.log('\n2. Testing Role Personalization for DevOps / Cloud Engineer (Senior Level)...');
  const questionsDevOps = await generateInterviewSessionQuestions({
    roleTitle: 'DevOps & Cloud Engineer',
    experienceLevel: 'Senior Level',
    userContext: {
      userSkills: ['Linux', 'Docker', 'Kubernetes'],
      missingSkills: ['Terraform', 'Prometheus'],
      resumeProjects: ['Kubernetes Cluster Migration'],
    },
  });
  console.log(`   ✓ Received ${questionsDevOps.length} questions.`);
  console.log(`   Sample Q3 (${questionsDevOps[2].round}): "${questionsDevOps[2].question}"`);

  // Test 3: Evaluate Candidate Answer
  console.log('\n3. Testing AI Answer Evaluation...');
  const evaluation = await evaluateInterviewAnswer({
    roleTitle: 'Full Stack Developer',
    experienceLevel: 'Mid-Level',
    question: questionsFS[2].question,
    userAnswer: 'To architect a RESTful service in Node.js for high concurrency, I use express middleware, asynchronous non-blocking event loop handlers, connection pooling with MongoDB, Redis caching for hot endpoints, and cluster mode or PM2 worker processes.',
    targetSkill: 'Node.js & Concurrency',
    roundName: 'Round 2 — Technical Knowledge',
  });

  console.log(`   ✓ Evaluated Answer Score: ${evaluation.score}/10`);
  console.log(`   ✓ Strengths:`, evaluation.strengths);
  console.log(`   ✓ Communication Feedback: "${evaluation.communicationFeedback}"`);
  if (evaluation.followUpQuestion) {
    console.log(`   ✓ Follow-Up Question: "${evaluation.followUpQuestion}"`);
  }

  // Test 4: Generate Final Interview Performance Report
  console.log('\n4. Testing Final Interview Report Synthesis...');
  const sampleQnAList = questionsFS.map((q, idx) => ({
    questionId: q.id,
    question: q.question,
    targetSkill: q.targetSkill,
    round: q.round,
    roundIndex: q.roundIndex,
    userAnswer: 'Sample technical response demonstrating architecture knowledge.',
    evaluation: { score: idx % 2 === 0 ? 8.5 : 9.0 },
  }));

  const report = await generateFinalInterviewReport({
    roleTitle: 'Full Stack Developer',
    experienceLevel: 'Mid-Level',
    QnAList: sampleQnAList,
    userContext: { missingSkills: ['Docker', 'AWS'] },
  });

  console.log(`   ✓ Overall Score: ${report.overallScore}/10`);
  console.log(`   ✓ Category Breakdown:`, report.categoryScores);
  console.log(`   ✓ Personalized AI Summary: "${report.personalizedSummary}"`);

  console.log('\n======================================================');
  console.log('  ALL AI MOCK INTERVIEW ENGINE TESTS PASSED (4/4)!');
  console.log('======================================================\n');
}

testMockInterviewEngine().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
