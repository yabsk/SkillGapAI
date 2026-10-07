const express = require('express');
const router = express.Router();
const { getReadinessScore } = require('../controllers/readinessController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReadinessScore);

module.exports = router;
