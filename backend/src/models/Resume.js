const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rawFilePath: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      default: '',
    },
    parsedText: {
      type: String,
      default: '',
    },
    parsedDate: {
      type: Date,
      default: Date.now,
    },
    extractedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    experienceYears: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
