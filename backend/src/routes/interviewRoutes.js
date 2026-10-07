const express = require('express');
const router = express.Router();
const { generateQuestions, evaluateAnswer, generateReport } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-questions', protect, generateQuestions);
router.post('/evaluate-answer', protect, evaluateAnswer);
router.post('/generate-report', protect, generateReport);

module.exports = router;
