const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

// Get all experience items (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    const experiences = await Experience.find(query).sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error: error.message });
  }
});

// Get single experience item (public)
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error: error.message });
  }
});

// Create experience item (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, location, description, startDate, endDate, current, type } = req.body;

    if (!title || !company || !description || !startDate) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const experience = new Experience({
      title,
      company,
      location: location || '',
      description,
      startDate,
      endDate: current ? null : endDate,
      current: current || false,
      type: type || 'Work'
    });

    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error creating experience', error: error.message });
  }
});

// Update experience item (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, company, location, description, startDate, endDate, current, type } = req.body;
    
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    if (title) experience.title = title;
    if (company) experience.company = company;
    if (location !== undefined) experience.location = location;
    if (description) experience.description = description;
    if (startDate) experience.startDate = startDate;
    if (current !== undefined) {
      experience.current = current;
      if (current) {
        experience.endDate = null;
      } else if (endDate) {
        experience.endDate = endDate;
      }
    } else if (endDate !== undefined) {
      experience.endDate = endDate;
    }
    if (type) experience.type = type;

    await experience.save();
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error updating experience', error: error.message });
  }
});

// Delete experience item (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience', error: error.message });
  }
});

module.exports = router;

