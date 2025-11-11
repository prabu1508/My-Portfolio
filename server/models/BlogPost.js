const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  published: {
    type: Boolean,
    default: false
  },
  author: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlogPost', blogPostSchema);

