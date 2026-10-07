const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  createSkill,
  createJobRole,
  createResource,
  createProject,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.post('/skills', createSkill);
router.post('/job-roles', createJobRole);
router.post('/resources', createResource);
router.post('/projects', createProject);

module.exports = router;
