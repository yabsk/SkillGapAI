const { getTailoredRecommendations } = require('../services/recommendationService');

// @desc    Get tailored recommendations (Courses, Certifications, Coding Practice, Projects)
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const recommendations = await getTailoredRecommendations(req.user._id);
    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getRecommendations,
};
