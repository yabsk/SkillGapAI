const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Course', 'Tutorial', 'Documentation', 'Video'],
      default: 'Course',
    },
    url: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      default: 'Online Learning',
    },
    estimatedHours: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LearningResource', learningResourceSchema);
