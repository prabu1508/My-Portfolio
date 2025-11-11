const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Other'],
    default: 'Other'
  },
  proficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  },
  icon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);

