const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Get all blog posts (public - only published)
router.get('/', async (req, res) => {
  try {
    const { tag, published } = req.query;
    let query = {};

    if (published === 'all') {
      // Admin can see all, but public route only shows published
      query = {};
    } else {
      query.published = true;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
});

// Get all blog posts including unpublished (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
});

// Get single blog post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    if (!post.published) {
      return res.status(403).json({ message: 'Blog post not published' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

// Create blog post (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt, tags, published } = req.body;
    
    const postData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      published: published === 'true' || published === true
    };

    if (tags) {
      try {
        // Try parsing as JSON first (in case it's stringified)
        const parsed = typeof tags === 'string' ? JSON.parse(tags) : tags;
        postData.tags = Array.isArray(parsed) 
          ? parsed 
          : tags.split(',').map(t => t.trim());
      } catch {
        // If not JSON, treat as comma-separated string
        postData.tags = tags.split(',').map(t => t.trim());
      }
    }

    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = new BlogPost(postData);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
});

// Update blog post (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt, tags, published } = req.body;
    
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (published !== undefined) post.published = published === 'true' || published === true;

    if (tags) {
      try {
        // Try parsing as JSON first (in case it's stringified)
        const parsed = typeof tags === 'string' ? JSON.parse(tags) : tags;
        post.tags = Array.isArray(parsed) 
          ? parsed 
          : tags.split(',').map(t => t.trim());
      } catch {
        // If not JSON, treat as comma-separated string
        post.tags = tags.split(',').map(t => t.trim());
      }
    }

    if (req.file) {
      // Delete old image if exists
      if (post.image) {
        const oldImagePath = path.join(__dirname, '..', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
});

// Delete blog post (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Delete associated image
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
});

module.exports = router;

