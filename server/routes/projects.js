const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload'); // ✅ FIXED
const fs = require('fs');
const path = require('path');

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { category, technology, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (technology) query.technologies = { $in: [technology] };
    if (featured === 'true') query.featured = true;

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Create project (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, category, githubUrl, liveUrl, featured } = req.body;
    
    const projectData = {
      title,
      description,
      category,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      featured: featured === 'true' || featured === true
    };

    if (technologies) {
      try {
        const parsed = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        projectData.technologies = Array.isArray(parsed) 
          ? parsed 
          : technologies.split(',').map(t => t.trim());
      } catch {
        projectData.technologies = technologies.split(',').map(t => t.trim());
      }
    }

    // ✅ Upload image to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      projectData.image = result.secure_url; // ✅ Cloudinary URL stored
    }

    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Update project (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, category, githubUrl, liveUrl, featured } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;

    if (technologies) {
      try {
        const parsed = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        project.technologies = Array.isArray(parsed) 
          ? parsed 
          : technologies.split(',').map(t => t.trim());
      } catch {
        project.technologies = technologies.split(',').map(t => t.trim());
      }
    }

    // ✅ Upload new image to Cloudinary if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      project.image = result.secure_url; // ✅ Replace old URL
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // ✅ No local fs delete needed (Cloudinary handles storage)
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;
