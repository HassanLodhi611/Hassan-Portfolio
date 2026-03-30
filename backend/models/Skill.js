const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '⚡',
    },
    accentColor: {
      type: String,
      default: 'mint', // mint | gold | red | purple
    },
    tags: {
      type: [String],
      default: [],
    },
    bars: [
      {
        label: { type: String, required: true },
        width: { type: Number, min: 0, max: 100, required: true },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', SkillSchema);
