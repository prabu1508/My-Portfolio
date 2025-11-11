const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get all contact messages (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { read } = req.query;
    let query = {};

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages', error: error.message });
  }
});

// Get single contact message (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact message', error: error.message });
  }
});

// Mark message as read/unread (admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { read } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    if (read !== undefined) {
      contact.read = read;
    }

    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact message', error: error.message });
  }
});

// Delete contact message (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact message', error: error.message });
  }
});

module.exports = router;

