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

// Register All 10 API Route Groups
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/job-roles', require('./routes/jobRoleRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/recommendations', require('./routes/recommendationsRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/resume-evaluation', require('./routes/resumeEvaluationRoutes'));
app.use('/api/readiness', require('./routes/readinessRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/copilot', require('./routes/copilotRoutes'));
app.use('/api/projects', require('./routes/projectGenRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));


// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
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
    ],
    time: new Date().toISOString(),
  });
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
