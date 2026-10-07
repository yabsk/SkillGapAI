const express = require('express');
const router = express.Router();
const { uploadResume, getMyResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/my-resume', protect, getMyResume);

module.exports = router;
