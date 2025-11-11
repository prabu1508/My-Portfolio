const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateThumbnail, uploadsDir } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Get profile (public)
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Create or update profile (admin only). Accepts optional avatar and resume uploads.
router.put('/', auth, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, email, location, bio, skills, github, linkedin } = req.body;
    const data = {
      name,
      email: String(email || '').trim().toLowerCase(),
      location,
      bio,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      social: { github, linkedin }
    };
    // handle avatar upload
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const file = req.files.avatar[0];
      data.avatar = `/uploads/${file.filename}`;
      // try to generate thumbnail (if sharp is installed)
      try {
        const fullPath = path.join(uploadsDir, file.filename);
        const thumbPath = await generateThumbnail(fullPath, 200);
        if (thumbPath) {
          data.avatarThumb = `/uploads/${path.basename(thumbPath)}`;
        }
      } catch (e) {
        console.error('Thumbnail generation failed:', e.message);
      }
    }

    // handle resume upload
    if (req.files && req.files.resume && req.files.resume[0]) {
      const file = req.files.resume[0];
      data.resume = `/uploads/${file.filename}`;
    }

    // remove flags
    const removeAvatar = req.body.removeAvatar === 'true' || req.body.removeAvatar === true;
    const removeResume = req.body.removeResume === 'true' || req.body.removeResume === true;

    // save into existing profile or create
    let profile = await Profile.findOne();
    if (profile) {
      // delete old files if requested
      if (removeAvatar && profile.avatar) {
        try { fs.unlinkSync(path.join(uploadsDir, path.basename(profile.avatar))); } catch (e) {}
        if (profile.avatarThumb) { try { fs.unlinkSync(path.join(uploadsDir, path.basename(profile.avatarThumb))); } catch (e) {} }
        profile.avatar = undefined;
        profile.avatarThumb = undefined;
      }
      if (removeResume && profile.resume) {
        try { fs.unlinkSync(path.join(uploadsDir, path.basename(profile.resume))); } catch (e) {}
        profile.resume = undefined;
      }

      profile = Object.assign(profile, data);
      await profile.save();
    } else {
      profile = new Profile(data);
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
