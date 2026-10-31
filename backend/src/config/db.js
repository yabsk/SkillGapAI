const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillgap_ai';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to Database: ${conn.connection.host}`);
    // Auto-seed default master skills and job roles if database is newly initialized
    await runInlineSeed();
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to primary MongoDB (${error.message}).`);
    console.log(`[MongoDB Fallback] Starting in-memory MongoMemoryServer...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB Memory Server] Connected successfully to In-Memory DB: ${memUri}`);

      // Auto seed initial data in memory DB
      await runInlineSeed();
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB Error] Failed to initialize fallback memory server: ${memErr.message}`);
    }
  }
};

const runInlineSeed = async (force = false) => {
  try {
    const Skill = require('../models/Skill');
    const JobRole = require('../models/JobRole');
    const LearningResource = require('../models/LearningResource');
    const ProjectRecommendation = require('../models/ProjectRecommendation');
    const User = require('../models/User');

    const roleCount = await JobRole.countDocuments();
    if (roleCount > 0 && !force) {
      return; // Already seeded with job roles
    }

    console.log('[Auto-Seed] Initializing skills, job roles, learning resources, and default accounts...');

    // 1. Create Default Users (Check existence first to prevent duplicate key errors)
    const adminExists = await User.findOne({ email: 'admin@skillgap.ai' });
    if (!adminExists) {
      await User.create({ name: 'System Admin', email: 'admin@skillgap.ai', password: 'adminpassword123', role: 'admin' });
    }

    const demoExists = await User.findOne({ email: 'keerthi@gmail.com' });
    let demoUser = demoExists;
    if (!demoExists) {
      demoUser = await User.create({ name: 'Keerthi Sri', email: 'keerthi@gmail.com', password: 'userpassword123', role: 'user' });
    }

    // 2. Create Master Skills if empty
    const seedSkills = [
      { skillName: 'Java', category: 'Programming', description: 'Core Java, OOPs, Collections' },
      { skillName: 'Python', category: 'Programming', description: 'Python syntax, Data structures' },
      { skillName: 'JavaScript', category: 'Frontend', description: 'ES6+, Async/Await, DOM' },
      { skillName: 'React JS', category: 'Frontend', description: 'Components, Hooks, Context API' },
      { skillName: 'HTML5', category: 'Frontend', description: 'Semantic HTML markup' },
      { skillName: 'CSS3', category: 'Frontend', description: 'Flexbox, CSS Grid, Responsive' },
      { skillName: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS' },
      { skillName: 'Node JS', category: 'Backend', description: 'Event-driven JavaScript runtime' },
      { skillName: 'Express JS', category: 'Backend', description: 'RESTful API web framework' },
      { skillName: 'Spring Boot', category: 'Backend', description: 'Java Enterprise REST framework' },
      { skillName: 'REST APIs', category: 'Backend', description: 'RESTful web services, HTTP, JSON' },
      { skillName: 'MongoDB', category: 'Database', description: 'NoSQL document database' },
      { skillName: 'SQL', category: 'Database', description: 'Relational Database Queries' },
      { skillName: 'Git', category: 'Cloud/DevOps', description: 'Version control system' },
      { skillName: 'Docker', category: 'Cloud/DevOps', description: 'Containerization deployment' },
      { skillName: 'AWS', category: 'Cloud/DevOps', description: 'Amazon Web Services Cloud' },
      { skillName: 'Kubernetes', category: 'Cloud/DevOps', description: 'Container orchestration' },
      { skillName: 'CI/CD', category: 'Cloud/DevOps', description: 'Continuous integration pipelines' },
    ];

    let allSkills = await Skill.find();
    if (allSkills.length === 0) {
      allSkills = await Skill.insertMany(seedSkills);
    }
    const skillMap = {};
    allSkills.forEach((s) => { skillMap[s.skillName] = s._id; });

    // 3. Create Job Roles if empty
    if (roleCount === 0 || force) {
      const jobRoles = [
        {
          title: 'Full Stack Developer',
          industryCategory: 'Software Engineering',
          description: 'Build end-to-end web applications using modern React and Node.js tech stacks.',
          requiredSkills: [
            { skill: skillMap['React JS'], proficiencyLevel: 'Advanced', priorityWeight: 9, isMandatory: true },
            { skill: skillMap['JavaScript'], proficiencyLevel: 'Advanced', priorityWeight: 9, isMandatory: true },
            { skill: skillMap['Node JS'], proficiencyLevel: 'Intermediate', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['Express JS'], proficiencyLevel: 'Intermediate', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['MongoDB'], proficiencyLevel: 'Intermediate', priorityWeight: 7, isMandatory: true },
            { skill: skillMap['REST APIs'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['HTML5'], proficiencyLevel: 'Intermediate', priorityWeight: 5, isMandatory: false },
            { skill: skillMap['CSS3'], proficiencyLevel: 'Intermediate', priorityWeight: 5, isMandatory: false },
            { skill: skillMap['Git'], proficiencyLevel: 'Intermediate', priorityWeight: 6, isMandatory: true },
            { skill: skillMap['Docker'], proficiencyLevel: 'Beginner', priorityWeight: 4, isMandatory: false },
          ].filter((item) => item.skill),
        },
        {
          title: 'Java Backend Engineer',
          industryCategory: 'Enterprise Software',
          description: 'Design robust server applications and REST microservices in Java and Spring Boot.',
          requiredSkills: [
            { skill: skillMap['Java'], proficiencyLevel: 'Advanced', priorityWeight: 10, isMandatory: true },
            { skill: skillMap['Spring Boot'], proficiencyLevel: 'Advanced', priorityWeight: 9, isMandatory: true },
            { skill: skillMap['REST APIs'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['SQL'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['Git'], proficiencyLevel: 'Intermediate', priorityWeight: 6, isMandatory: true },
            { skill: skillMap['Docker'], proficiencyLevel: 'Intermediate', priorityWeight: 5, isMandatory: false },
          ].filter((item) => item.skill),
        },
        {
          title: 'DevOps & Cloud Engineer',
          industryCategory: 'Cloud Infrastructure',
          description: 'Automate CI/CD pipelines, containerize applications, and manage AWS infrastructure.',
          requiredSkills: [
            { skill: skillMap['Docker'], proficiencyLevel: 'Advanced', priorityWeight: 10, isMandatory: true },
            { skill: skillMap['AWS'], proficiencyLevel: 'Advanced', priorityWeight: 9, isMandatory: true },
            { skill: skillMap['Kubernetes'], proficiencyLevel: 'Intermediate', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['CI/CD'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
            { skill: skillMap['Python'], proficiencyLevel: 'Intermediate', priorityWeight: 7, isMandatory: true },
            { skill: skillMap['Git'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
          ].filter((item) => item.skill),
        },
      ];

      const insertedRoles = await JobRole.insertMany(jobRoles);
      console.log(`[Auto-Seed] Successfully created ${insertedRoles.length} default job roles.`);

      // Update demo user's target role
      if (demoUser && insertedRoles[0]) {
        await User.updateOne({ _id: demoUser._id }, { targetRole: insertedRoles[0]._id });
      }
    }

    // 4. Learning Resources
    const resCount = await LearningResource.countDocuments();
    if (resCount === 0) {
      await LearningResource.insertMany([
        { skill: skillMap['React JS'], title: 'React Official Documentation & Interactive Guide', type: 'Documentation', url: 'https://react.dev/learn', platform: 'React.dev', estimatedHours: 15 },
        { skill: skillMap['React JS'], title: 'Complete React Developer Course 2026', type: 'Course', url: 'https://www.udemy.com/', platform: 'Udemy', estimatedHours: 40 },
        { skill: skillMap['Node JS'], title: 'Node.js Express & MongoDB Masterclass', type: 'Course', url: 'https://www.udemy.com/', platform: 'Udemy', estimatedHours: 35 },
        { skill: skillMap['MongoDB'], title: 'MongoDB University - Basics', type: 'Course', url: 'https://learn.mongodb.com/', platform: 'MongoDB', estimatedHours: 12 },
        { skill: skillMap['Docker'], title: 'Docker Beginners Handbook', type: 'Tutorial', url: 'https://docs.docker.com/', platform: 'Docker Docs', estimatedHours: 8 },
        { skill: skillMap['AWS'], title: 'AWS Cloud Practitioner & Architect Guide', type: 'Course', url: 'https://aws.amazon.com/training/', platform: 'AWS Skill Builder', estimatedHours: 25 },
      ].filter((item) => item.skill));
    }

    // 5. Project Recommendations
    const projCount = await ProjectRecommendation.countDocuments();
    if (projCount === 0) {
      await ProjectRecommendation.insertMany([
        { skill: skillMap['React JS'], title: 'Interactive Portfolio with Live Resume Analytics', description: 'Build a responsive personal website using React.', difficultyLevel: 'Beginner', techStack: ['React', 'CSS3', 'Vite'] },
        { skill: skillMap['Node JS'], title: 'TaskFlow - RESTful Task Management Backend', description: 'Build an Express REST API with JWT auth and MongoDB.', difficultyLevel: 'Intermediate', techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'] },
        { skill: skillMap['Docker'], title: 'Dockerized Microservices Web Application', description: 'Containerize frontend React app and backend Node API using Docker Compose.', difficultyLevel: 'Advanced', techStack: ['Docker', 'React', 'Node.js'] },
      ].filter((item) => item.skill));
    }

    console.log('[Auto-Seed] Initial database successfully verified and ready.');
  } catch (err) {
    console.error('[Auto-Seed Error]:', err.message);
  }
};

connectDB.runInlineSeed = runInlineSeed;
module.exports = connectDB;
