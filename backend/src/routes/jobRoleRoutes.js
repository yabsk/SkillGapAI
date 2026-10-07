const express = require('express');
const router = express.Router();
const { getJobRoles, getJobRoleById, selectTargetRole } = require('../controllers/jobRoleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getJobRoles);
router.get('/:id', getJobRoleById);
router.put('/select-target', protect, selectTargetRole);

module.exports = router;
