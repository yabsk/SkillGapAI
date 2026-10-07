const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Skill = require('../models/Skill');
const JobRole = require('../models/JobRole');
const LearningResource = require('../models/LearningResource');
const ProjectRecommendation = require('../models/ProjectRecommendation');
const User = require('../models/User');

const seedSkills = [
  { skillName: 'Java', category: 'Programming', description: 'Core Java, OOPs, Collections, Multithreading' },
  { skillName: 'Python', category: 'Programming', description: 'Python syntax, Data structures, Scripting' },
  { skillName: 'C++', category: 'Programming', description: 'Object-oriented programming, Memory management' },
  { skillName: 'JavaScript', category: 'Frontend', description: 'ES6+, Async/Await, DOM manipulation' },
  { skillName: 'React JS', category: 'Frontend', description: 'Components, Hooks, Context API, Redux' },
  { skillName: 'HTML5', category: 'Frontend', description: 'Semantic HTML markup and web structure' },
  { skillName: 'CSS3', category: 'Frontend', description: 'Flexbox, CSS Grid, Responsive design' },
  { skillName: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS framework' },
  { skillName: 'Node JS', category: 'Backend', description: 'Event-driven JavaScript runtime server' },
  { skillName: 'Express JS', category: 'Backend', description: 'RESTful API web framework for Node.js' },
  { skillName: 'Spring Boot', category: 'Backend', description: 'Java Enterprise REST framework' },
  { skillName: 'REST APIs', category: 'Backend', description: 'RESTful web services, HTTP verbs, JSON' },
  { skillName: 'MongoDB', category: 'Database', description: 'NoSQL document-oriented database' },
  { skillName: 'SQL', category: 'Database', description: 'Relational Database Queries & Schema Design' },
  { skillName: 'PostgreSQL', category: 'Database', description: 'Advanced relational SQL database' },
  { skillName: 'Git', category: 'Cloud/DevOps', description: 'Version control system' },
  { skillName: 'Docker', category: 'Cloud/DevOps', description: 'Containerization and container deployment' },
  { skillName: 'AWS', category: 'Cloud/DevOps', description: 'Amazon Web Services Cloud Infrastructure' },
  { skillName: 'Communication', category: 'Soft Skill', description: 'Effective team communication & presenting' },
  { skillName: 'Agile/Scrum', category: 'Soft Skill', description: 'Agile sprint planning and team collaboration' },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillgap_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB...');

    // Clear existing data (optional for clean seed)
    await Skill.deleteMany({});
    await JobRole.deleteMany({});
    await LearningResource.deleteMany({});
    await ProjectRecommendation.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed Script] Cleared existing data.');

    // 1. Create Default Admin User & Demo User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@skillgap.ai',
      password: 'adminpassword123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Keerthi Sri',
      email: 'keerthi@gmail.com',
      password: 'userpassword123',
      role: 'user',
    });

    console.log('[Seed Script] Admin & User created successfully.');

    // 2. Create Master Skills
    const insertedSkills = await Skill.insertMany(seedSkills);
    console.log(`[Seed Script] Seeded ${insertedSkills.length} master skills.`);

    const skillMap = {};
    insertedSkills.forEach((s) => {
      skillMap[s.skillName] = s._id;
    });

    // 3. Create Job Roles
    const jobRoles = [
      {
        title: 'Full Stack Developer',
        industryCategory: 'Software Engineering',
        description: 'Build end-to-end web applications using modern frontend and backend tech stacks.',
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
        ],
      },
      {
        title: 'Java Backend Engineer',
        industryCategory: 'Enterprise Software',
        description: 'Design robust scalable server applications and REST microservices in Java and Spring Boot.',
        requiredSkills: [
          { skill: skillMap['Java'], proficiencyLevel: 'Advanced', priorityWeight: 10, isMandatory: true },
          { skill: skillMap['Spring Boot'], proficiencyLevel: 'Advanced', priorityWeight: 9, isMandatory: true },
          { skill: skillMap['REST APIs'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
          { skill: skillMap['SQL'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
          { skill: skillMap['Git'], proficiencyLevel: 'Intermediate', priorityWeight: 6, isMandatory: true },
          { skill: skillMap['Docker'], proficiencyLevel: 'Intermediate', priorityWeight: 5, isMandatory: false },
        ],
      },
      {
        title: 'DevOps & Cloud Engineer',
        industryCategory: 'Cloud Infrastructure',
        description: 'Automate CI/CD pipelines, containerize applications, and manage cloud infrastructure.',
        requiredSkills: [
          { skill: skillMap['Docker'], proficiencyLevel: 'Advanced', priorityWeight: 10, isMandatory: true },
          { skill: skillMap['AWS'], proficiencyLevel: 'Advanced', priorityWeight: 9, isMandatory: true },
          { skill: skillMap['Python'], proficiencyLevel: 'Intermediate', priorityWeight: 7, isMandatory: true },
          { skill: skillMap['Git'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
        ],
      },
    ];

    const insertedRoles = await JobRole.insertMany(jobRoles);
    console.log(`[Seed Script] Seeded ${insertedRoles.length} job roles.`);

    // Set demo user's target role to Full Stack Developer
    demoUser.targetRole = insertedRoles[0]._id;
    await demoUser.save();

    // 4. Create Learning Resources
    const learningResources = [
      {
        skill: skillMap['React JS'],
        title: 'React Official Documentation & Interactive Guide',
        type: 'Documentation',
        url: 'https://react.dev/learn',
        platform: 'React.dev',
        estimatedHours: 15,
      },
      {
        skill: skillMap['React JS'],
        title: 'Complete React Developer Course 2026',
        type: 'Course',
        url: 'https://www.udemy.com/course/react-the-complete-guide/',
        platform: 'Udemy',
        estimatedHours: 40,
      },
      {
        skill: skillMap['Node JS'],
        title: 'Node.js Express & MongoDB Masterclass',
        type: 'Course',
        url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
        platform: 'Udemy',
        estimatedHours: 35,
      },
      {
        skill: skillMap['MongoDB'],
        title: 'MongoDB University - M001 Basics',
        type: 'Course',
        url: 'https://learn.mongodb.com/',
        platform: 'MongoDB University',
        estimatedHours: 12,
      },
      {
        skill: skillMap['Docker'],
        title: 'Docker Beginners Handbook',
        type: 'Tutorial',
        url: 'https://docs.docker.com/get-started/',
        platform: 'Docker Docs',
        estimatedHours: 8,
      },
    ];

    await LearningResource.insertMany(learningResources);
    console.log('[Seed Script] Seeded Learning Resources.');

    // 5. Create Project Recommendations
    const projectRecommendations = [
      {
        skill: skillMap['React JS'],
        title: 'Interactive Portfolio with Live Resume Analytics',
        description: 'Build a responsive personal website using React and CSS glassmorphism.',
        difficultyLevel: 'Beginner',
        techStack: ['React', 'CSS3', 'Vite'],
      },
      {
        skill: skillMap['Node JS'],
        title: 'TaskFlow - RESTful Task Management Backend',
        description: 'Build an Express REST API with JWT authentication, role authorization, and MongoDB.',
        difficultyLevel: 'Intermediate',
        techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      },
      {
        skill: skillMap['Docker'],
        title: 'Dockerized Microservices Web Application',
        description: 'Containerize frontend React app and backend Node API using Docker Compose.',
        difficultyLevel: 'Advanced',
        techStack: ['Docker', 'Docker Compose', 'Node.js', 'React'],
      },
    ];

    await ProjectRecommendation.insertMany(projectRecommendations);
    console.log('[Seed Script] Seeded Project Recommendations.');

    console.log('\n[Seed Script] Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
