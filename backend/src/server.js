const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Core Middleware
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, postman, server-to-server)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Resume Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & Health Check Endpoints
const healthPayload = {
  status: 'healthy',
  system: 'SkillGap AI REST API Server',
  modules: [
    'Auth APIs',
    'User Profile APIs',
    'NLP Resume Parser',
    'Semantic Skill Extractor',
    'Skill Gap Analyzer',
    'Roadmap Generator',
    'Recommendation Engine',
    'Resume Evaluation & ATS Checker',
    'Job Readiness Score Evaluator',
    'Admin Management APIs',
    'Copilot AI Chat',
    'Mock Interview Simulator',
    'Project Generator',
  ],
  time: new Date().toISOString(),
};

app.get('/', (req, res) => res.json({ status: 'online', message: 'SkillGap AI REST API is running.', ...healthPayload }));
app.get('/health', (req, res) => res.json(healthPayload));
app.get('/api/health', (req, res) => res.json(healthPayload));

// Register All API Route Groups under /api and direct alias to prevent 404s
const apiRoutes = [
  ['/auth', require('./routes/authRoutes')],
  ['/users', require('./routes/userRoutes')],
  ['/resumes', require('./routes/resumeRoutes')],
  ['/job-roles', require('./routes/jobRoleRoutes')],
  ['/analysis', require('./routes/analysisRoutes')],
  ['/recommendations', require('./routes/recommendationsRoutes')],
  ['/roadmap', require('./routes/roadmapRoutes')],
  ['/resume-evaluation', require('./routes/resumeEvaluationRoutes')],
  ['/readiness', require('./routes/readinessRoutes')],
  ['/admin', require('./routes/adminRoutes')],
  ['/copilot', require('./routes/copilotRoutes')],
  ['/projects', require('./routes/projectGenRoutes')],
  ['/interview', require('./routes/interviewRoutes')],
];

apiRoutes.forEach(([subPath, router]) => {
  app.use(`/api${subPath}`, router);
  app.use(subPath, router); // Handles calls even if client omits /api prefix
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`  SkillGap AI Backend Server Running on Port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});
