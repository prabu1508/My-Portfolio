const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
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
        // Try parsing as JSON first (in case it's stringified)
        const parsed = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        projectData.technologies = Array.isArray(parsed) 
          ? parsed 
          : technologies.split(',').map(t => t.trim());
      } catch {
        // If not JSON, treat as comma-separated string
        projectData.technologies = technologies.split(',').map(t => t.trim());
      }
    }

    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
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
        // Try parsing as JSON first (in case it's stringified)
        const parsed = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        project.technologies = Array.isArray(parsed) 
          ? parsed 
          : technologies.split(',').map(t => t.trim());
      } catch {
        // If not JSON, treat as comma-separated string
        project.technologies = technologies.split(',').map(t => t.trim());
      }
    }

    if (req.file) {
      // Delete old image if exists
      if (project.image) {
        const oldImagePath = path.join(__dirname, '..', project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      project.image = `/uploads/${req.file.filename}`;
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

    // Delete associated image
    if (project.image) {
      const imagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;

