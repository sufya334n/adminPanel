const express = require('express');
const router = express.Router();
const About = require('../models/About');

// Get about information
router.get('/', async (req, res) => {
  try {
    // Find the first about document or create one if it doesn't exist
    let about = await About.findOne();
    
    if (!about) {
      about = await About.create({});
    }
    
    res.status(200).json(about);
  } catch (error) {
    console.error('Error fetching about information:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update about information
router.put('/', async (req, res) => {
  try {
    // Find the first about document or create one if it doesn't exist
    let about = await About.findOne();
    
    if (!about) {
      about = await About.create(req.body);
    } else {
      // Update the existing document with the request body
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true });
    }
    
    res.status(200).json(about);
  } catch (error) {
    console.error('Error updating about information:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;