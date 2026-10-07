const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningResource',
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectRecommendation',
    },
  ],
});

const careerRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRole',
      required: true,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    overallProgress: {
      type: Number,
      default: 0,
    },
    milestones: [milestoneSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);
