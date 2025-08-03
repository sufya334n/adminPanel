const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo');

// Get contact info
router.get('/', async (req, res) => {
  try {
    // Hamesha sirf ek hi contact info hoga system mein
    // Agar koi contact info nahi hai to first one create kar denge
    let contactInfo = await ContactInfo.findOne();
    
    if (!contactInfo) {
      // Agar koi contact info nahi hai to default values ke sath create kar denge
      contactInfo = await ContactInfo.create({
        phone: "+92-300-000000",
        email: "info@example.com",
        address: "SIBAU MIRPURKHS, Pakistan"
      });
    }
    
    res.json(contactInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update contact info
router.put('/', async (req, res) => {
  try {
    const { phone, email, address } = req.body;
    
    // Validation
    if (!phone || !email || !address) {
      return res.status(400).json({ message: 'Phone, email and address are required' });
    }
    
    // Find existing contact info or create new one
    let contactInfo = await ContactInfo.findOne();
    
    if (contactInfo) {
      // Update existing contact info
      contactInfo.phone = phone;
      contactInfo.email = email;
      contactInfo.address = address;
      contactInfo.updatedAt = Date.now();
      
      await contactInfo.save();
    } else {
      // Create new contact info
      contactInfo = await ContactInfo.create({
        phone,
        email,
        address
      });
    }
    
    res.json(contactInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;