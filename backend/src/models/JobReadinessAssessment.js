const mongoose = require('mongoose');

const jobReadinessAssessmentSchema = new mongoose.Schema(
  {
    analysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillGapAnalysis',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readinessScore: {
      type: Number,
      required: true,
      default: 0,
    },
    evaluationDate: {
      type: Date,
      default: Date.now,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weakAreas: [
      {
        type: String,
      },
    ],
    atsSuggestions: [
      {
        type: String,
      },
    ],
    missingKeywords: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobReadinessAssessment', jobReadinessAssessmentSchema);
