const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Cloud/DevOps', 'Programming', 'AI/ML', 'Soft Skill', 'Other'],
      default: 'Other',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
