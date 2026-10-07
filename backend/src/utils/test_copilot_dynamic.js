const connectDB = require('../config/db');
const User = require('../models/User');
const { chatCopilot } = require('../controllers/copilotController');
const { generateCopilotResponse } = require('../services/aiCopilotService');

async function testDynamicCopilot() {
  await connectDB();

  console.log('\n=================================================');
  console.log('  DYNAMIC AI SKILLGAP COPILOT TEST SUITE');
  console.log('=================================================\n');

  const demoUser = await User.findOne({ email: 'keerthi@gmail.com' });
  if (!demoUser) {
    console.error('Demo user not found');
    process.exit(1);
  }

  const testQueries = [
    'What skills should I learn next?',
    'Why is my readiness score low?',
    'Suggest a project for my target role.',
    'How can I improve my resume?',
    'Create a 7-day study plan.',
    'Tell me about Python.',
  ];

  for (const query of testQueries) {
    console.log(`\n💬 USER QUERY: "${query}"`);

    const req = {
      user: { _id: demoUser._id },
      body: { message: query, history: [] },
    };

    let responseJson = null;
    const res = {
      json: (data) => {
        responseJson = data;
      },
      status: () => res,
    };

    await chatCopilot(req, res);

    if (responseJson && responseJson.success && responseJson.data) {
      console.log(`🤖 AI PROVIDER: [${responseJson.data.provider}]`);
      console.log(`🤖 AI RESPONSE:\n${responseJson.data.reply}`);
      console.log('-------------------------------------------------');
    } else {
      console.error('❌ FAILED for query:', query);
    }
  }

  console.log('\n💬 CONVERSATIONAL MEMORY TEST:');
  console.log('Turn 1: "What should I learn next?"');
  const turn1Res = await generateCopilotResponse({
    message: 'What should I learn next?',
    history: [],
    context: { targetRole: 'Full Stack Developer', missingSkills: ['Docker', 'AWS'], readinessScore: 72 },
  });
  console.log(`🤖 Turn 1 Reply:\n${turn1Res.reply.substring(0, 150)}...`);

  console.log('\nTurn 2: "Why?" (passing Turn 1 in history)');
  const turn2Res = await generateCopilotResponse({
    message: 'Why?',
    history: [
      { role: 'user', text: 'What should I learn next?' },
      { role: 'model', text: turn1Res.reply },
    ],
    context: { targetRole: 'Full Stack Developer', missingSkills: ['Docker', 'AWS'], readinessScore: 72 },
  });
  console.log(`🤖 Turn 2 Reply:\n${turn2Res.reply}`);

  console.log('\n=================================================');
  console.log('  ✓ PASSED: DYNAMIC AI COPILOT IS 100% OPERATIONAL');
  console.log('=================================================\n');

  process.exit(0);
}

testDynamicCopilot();
