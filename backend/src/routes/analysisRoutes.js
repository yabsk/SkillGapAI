const express = require('express');
const router = express.Router();
const { runAnalysis, getLatestAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.post('/run', protect, runAnalysis);
router.get('/latest', protect, getLatestAnalysis);

module.exports = router;
