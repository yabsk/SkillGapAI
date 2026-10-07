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
  { skillName: 'Kubernetes', category: 'Cloud/DevOps', description: 'Container orchestration and cluster management' },
  { skillName: 'CI/CD', category: 'Cloud/DevOps', description: 'Continuous integration and continuous deployment pipelines' },
  { skillName: 'Communication', category: 'Soft Skill', description: 'Effective team communication & presenting' },
  { skillName: 'Agile/Scrum', category: 'Soft Skill', description: 'Agile sprint planning and team collaboration' },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillgap_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB...');

    // Clear existing data for fresh seed
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
          { skill: skillMap['Kubernetes'], proficiencyLevel: 'Intermediate', priorityWeight: 8, isMandatory: true },
          { skill: skillMap['CI/CD'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
          { skill: skillMap['Python'], proficiencyLevel: 'Intermediate', priorityWeight: 7, isMandatory: true },
          { skill: skillMap['Git'], proficiencyLevel: 'Advanced', priorityWeight: 8, isMandatory: true },
        ],
      },
    ];

    const insertedRoles = await JobRole.insertMany(jobRoles);
    console.log(`[Seed Script] Seeded ${insertedRoles.length} job roles.`);

    demoUser.targetRole = insertedRoles[0]._id;
    await demoUser.save();

    // 4. Create Official Learning Resources for All Core Skills
    const learningResources = [
      // Docker
      { skill: skillMap['Docker'], title: 'Docker Official Docs & Getting Started Guide', type: 'Documentation', url: 'https://docs.docker.com/get-started/', platform: 'Docker Docs', estimatedHours: 10 },
      { skill: skillMap['Docker'], title: 'Docker Containerization Masterclass', type: 'Course', url: 'https://www.freecodecamp.org/news/docker-simplified-with-hands-on-examples/', platform: 'freeCodeCamp', estimatedHours: 15 },
      // AWS
      { skill: skillMap['AWS'], title: 'AWS Official Developer Documentation', type: 'Documentation', url: 'https://docs.aws.amazon.com/', platform: 'AWS Documentation', estimatedHours: 20 },
      { skill: skillMap['AWS'], title: 'AWS Cloud Practitioner & Architect Guide', type: 'Course', url: 'https://aws.amazon.com/training/', platform: 'AWS Skill Builder', estimatedHours: 25 },
      // Kubernetes
      { skill: skillMap['Kubernetes'], title: 'Kubernetes Official Documentation & Interactive Guide', type: 'Documentation', url: 'https://kubernetes.io/docs/home/', platform: 'Kubernetes.io', estimatedHours: 20 },
      { skill: skillMap['Kubernetes'], title: 'Kubernetes Cluster Administration Tutorial', type: 'Tutorial', url: 'https://www.freecodecamp.org/news/learn-kubernetes-in-under-3-hours/', platform: 'freeCodeCamp', estimatedHours: 15 },
      // React JS
      { skill: skillMap['React JS'], title: 'React Official Documentation & Interactive Guide', type: 'Documentation', url: 'https://react.dev/learn', platform: 'React.dev', estimatedHours: 15 },
      { skill: skillMap['React JS'], title: 'Modern React Component Masterclass', type: 'Course', url: 'https://www.freecodecamp.org/news/tag/react/', platform: 'freeCodeCamp', estimatedHours: 25 },
      // Node JS
      { skill: skillMap['Node JS'], title: 'Node.js Official Documentation & API Reference', type: 'Documentation', url: 'https://nodejs.org/en/docs/', platform: 'Nodejs.org', estimatedHours: 15 },
      { skill: skillMap['Node JS'], title: 'Node.js & Express REST API Course', type: 'Course', url: 'https://www.freecodecamp.org/news/tag/node-js/', platform: 'freeCodeCamp', estimatedHours: 20 },
      // Spring Boot
      { skill: skillMap['Spring Boot'], title: 'Spring Boot Official Guides & Reference Documentation', type: 'Documentation', url: 'https://spring.io/guides', platform: 'Spring.io', estimatedHours: 20 },
      { skill: skillMap['Spring Boot'], title: 'Building Enterprise REST Microservices in Spring Boot', type: 'Course', url: 'https://www.freecodecamp.org/news/tag/spring-boot/', platform: 'freeCodeCamp', estimatedHours: 25 },
      // Python
      { skill: skillMap['Python'], title: 'Python 3 Official Documentation & Tutorial', type: 'Documentation', url: 'https://docs.python.org/3/tutorial/', platform: 'Python.org', estimatedHours: 15 },
      { skill: skillMap['Python'], title: 'Python Programming & Data Analysis Course', type: 'Course', url: 'https://www.freecodecamp.org/news/tag/python/', platform: 'freeCodeCamp', estimatedHours: 20 },
      // SQL
      { skill: skillMap['SQL'], title: 'PostgreSQL Official Documentation & Manual', type: 'Documentation', url: 'https://www.postgresql.org/docs/', platform: 'PostgreSQL.org', estimatedHours: 15 },
      { skill: skillMap['SQL'], title: 'Relational Database SQL Query Masterclass', type: 'Tutorial', url: 'https://www.freecodecamp.org/news/tag/sql/', platform: 'freeCodeCamp', estimatedHours: 15 },
      // MongoDB
      { skill: skillMap['MongoDB'], title: 'MongoDB Official Manual & Developer Guides', type: 'Documentation', url: 'https://www.mongodb.com/docs/manual/', platform: 'MongoDB Docs', estimatedHours: 12 },
      { skill: skillMap['MongoDB'], title: 'MongoDB University M001 Basics Course', type: 'Course', url: 'https://learn.mongodb.com/', platform: 'MongoDB University', estimatedHours: 12 },
      // Git
      { skill: skillMap['Git'], title: 'Git Official Reference Documentation & Book', type: 'Documentation', url: 'https://git-scm.com/doc', platform: 'Git-scm.com', estimatedHours: 8 },
      // CI/CD
      { skill: skillMap['CI/CD'], title: 'GitHub Actions Official Documentation', type: 'Documentation', url: 'https://docs.github.com/en/actions', platform: 'GitHub Docs', estimatedHours: 10 },
    ];

    await LearningResource.insertMany(learningResources);
    console.log('[Seed Script] Seeded Learning Resources for all core skills.');

    // 5. Create Hands-on Project Recommendations for All Core Skills
    const projectRecommendations = [
      {
        skill: skillMap['Docker'],
        title: 'Multi-Container Microservice Stack with Docker Compose',
        description: 'Build and containerize a React frontend, Node/Express backend, and MongoDB database using Docker Compose.',
        difficultyLevel: 'Intermediate',
        techStack: ['Docker', 'Docker Compose', 'Nginx', 'Node.js'],
      },
      {
        skill: skillMap['AWS'],
        title: 'Automated AWS EC2 & S3 Cloud Hosting Pipeline',
        description: 'Deploy a web application on AWS EC2 with S3 media storage, IAM role policies, and CloudWatch metrics monitoring.',
        difficultyLevel: 'Intermediate',
        techStack: ['AWS EC2', 'AWS S3', 'IAM', 'CloudWatch'],
      },
      {
        skill: skillMap['Kubernetes'],
        title: 'Kubernetes Microservices Cluster with Helm & Ingress',
        description: 'Deploy a multi-service web application on Kubernetes using Helm charts, ingress controllers, and persistent volume claims.',
        difficultyLevel: 'Advanced',
        techStack: ['Kubernetes', 'Helm', 'kubectl', 'Ingress'],
      },
      {
        skill: skillMap['React JS'],
        title: 'Interactive Real-Time Analytics Dashboard',
        description: 'Develop a responsive React dashboard with dynamic data visualization, Context API state management, and REST data fetching.',
        difficultyLevel: 'Intermediate',
        techStack: ['React JS', 'JavaScript', 'Context API', 'Vite'],
      },
      {
        skill: skillMap['Node JS'],
        title: 'TaskFlow - RESTful Microservices API Gateway',
        description: 'Architect a Node.js Express REST API with JWT authentication, request validation, rate limiting, and MongoDB integration.',
        difficultyLevel: 'Intermediate',
        techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      },
      {
        skill: skillMap['Spring Boot'],
        title: 'Enterprise E-Commerce REST API Microservice',
        description: 'Build a production Spring Boot application with Spring Security, JPA Hibernate, PostgreSQL, and Swagger documentation.',
        difficultyLevel: 'Advanced',
        techStack: ['Spring Boot', 'Java', 'Spring Security', 'PostgreSQL'],
      },
      {
        skill: skillMap['Python'],
        title: 'Automated Data Pipeline & Predictive Analysis Engine',
        description: 'Write a Python application to ingest, clean, analyze, and visualize complex statistical datasets using Pandas and Matplotlib.',
        difficultyLevel: 'Beginner',
        techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      },
      {
        skill: skillMap['SQL'],
        title: 'Relational E-Commerce Database Schema & Query Engine',
        description: 'Design a 3NF normalized SQL database with complex joins, indexes, stored procedures, and ACID transactions.',
        difficultyLevel: 'Intermediate',
        techStack: ['SQL', 'PostgreSQL', 'Database Design'],
      },
      {
        skill: skillMap['MongoDB'],
        title: 'High-Throughput NoSQL Analytics Document Store',
        description: 'Build a MongoDB document database utilizing aggregation framework pipelines, indexes, and schema validation.',
        difficultyLevel: 'Intermediate',
        techStack: ['MongoDB', 'Mongoose', 'NoSQL'],
      },
      {
        skill: skillMap['Git'],
        title: 'Collaborative GitHub Repository with Feature Branching & Actions',
        description: 'Set up an open-source repository with branch protection rules, PR templates, and automated GitHub Actions workflows.',
        difficultyLevel: 'Beginner',
        techStack: ['Git', 'GitHub', 'GitHub Actions'],
      },
      {
        skill: skillMap['CI/CD'],
        title: 'Automated Multi-Stage CI/CD Deployment Pipeline',
        description: 'Build a GitHub Actions pipeline that runs linting, unit tests, builds Docker images, and deploys to cloud servers.',
        difficultyLevel: 'Intermediate',
        techStack: ['CI/CD', 'GitHub Actions', 'Docker'],
      },
    ];

    await ProjectRecommendation.insertMany(projectRecommendations);
    console.log('[Seed Script] Seeded Project Recommendations for all core skills.');

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
