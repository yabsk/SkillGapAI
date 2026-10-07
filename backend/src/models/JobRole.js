const mongoose = require('mongoose');

const skillRequirementSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  proficiencyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  priorityWeight: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  isMandatory: {
    type: Boolean,
    default: true,
  },
});

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job role title is required'],
      unique: true,
      trim: true,
    },
    industryCategory: {
      type: String,
      required: true,
      default: 'Software Engineering',
    },
    description: {
      type: String,
      default: '',
    },
    requiredSkills: [skillRequirementSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobRole', jobRoleSchema);
