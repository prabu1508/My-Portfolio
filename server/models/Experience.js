const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  current: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['Work', 'Education', 'Internship', 'Freelance'],
    default: 'Work'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);

