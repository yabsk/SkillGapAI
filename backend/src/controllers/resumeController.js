const Resume = require('../models/Resume');
const { extractTextFromFile, extractSkillsAndExperience } = require('../services/nlpService');

// @desc    Upload resume & parse skills
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF or DOCX file' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // 1. Extract raw text from uploaded file
    const parsedText = await extractTextFromFile(filePath);

    // 2. Extract skills and experience using NLP service
    const { extractedSkills, experienceYears } = await extractSkillsAndExperience(parsedText);

    // 3. Save or update resume record in MongoDB
    let resume = await Resume.findOne({ user: req.user._id });
    if (resume) {
      resume.rawFilePath = filePath;
      resume.fileName = fileName;
      resume.parsedText = parsedText;
      resume.extractedSkills = extractedSkills;
      resume.experienceYears = experienceYears;
      resume.parsedDate = Date.now();
      await resume.save();
    } else {
      resume = await Resume.create({
        user: req.user._id,
        rawFilePath: filePath,
        fileName,
        parsedText,
        extractedSkills,
        experienceYears,
      });
    }

    const populatedResume = await Resume.findById(resume._id).populate('extractedSkills');

    res.status(201).json({
      success: true,
      data: populatedResume,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's active resume
// @route   GET /api/resumes/my-resume
// @access  Private
const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).populate('extractedSkills');
    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  uploadResume,
  getMyResume,
};
