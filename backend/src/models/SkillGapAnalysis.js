const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  gapType: {
    type: String,
    enum: ['Missing', 'Proficiency Mismatch'],
    default: 'Missing',
  },
  priorityScore: {
    type: Number,
    default: 5,
  },
});

const skillGapAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRole',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    matchPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    matchedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    gaps: [skillGapSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);
