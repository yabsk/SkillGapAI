const express = require('express');
const router = express.Router();
const { chatCopilot } = require('../controllers/copilotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatCopilot);

module.exports = router;
