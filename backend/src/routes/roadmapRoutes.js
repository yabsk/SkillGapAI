const express = require('express');
const router = express.Router();
const { createRoadmap, getMyRoadmap, updateMilestoneStatus } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, createRoadmap);
router.get('/', protect, getMyRoadmap);
router.patch('/milestone/:skillId', protect, updateMilestoneStatus);

module.exports = router;
