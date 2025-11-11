const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const skills = await Skill.find(query).sort({ proficiency: -1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
});

// Get single skill (public)
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skill', error: error.message });
  }
});

// Create skill (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, proficiency, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Please provide name and category' });
    }

    const skill = new Skill({
      name,
      category,
      proficiency: proficiency || 50,
      icon: icon || ''
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Skill already exists' });
    }
    res.status(500).json({ message: 'Error creating skill', error: error.message });
  }
});

// Update skill (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, proficiency, icon } = req.body;
    
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (proficiency !== undefined) skill.proficiency = proficiency;
    if (icon !== undefined) skill.icon = icon;

    await skill.save();
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error: error.message });
  }
});

// Delete skill (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
});

module.exports = router;

