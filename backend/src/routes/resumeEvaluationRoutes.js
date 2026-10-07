const express = require('express');
const router = express.Router();
const { getAtsEvaluation } = require('../controllers/resumeEvaluationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/ats', protect, getAtsEvaluation);

module.exports = router;
