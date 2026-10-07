const express = require('express');
const router = express.Router();
const { generateCustomProject } = require('../controllers/projectGenController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-custom', protect, generateCustomProject);

module.exports = router;
