const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  location: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  social: {
    github: { type: String },
    linkedin: { type: String }
  },
  avatar: { type: String }, // path to uploaded avatar (relative to /uploads)
  resume: { type: String } // path to uploaded resume file
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
