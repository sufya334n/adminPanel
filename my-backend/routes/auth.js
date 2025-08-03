const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Your Mongoose admin model

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Optional: You can generate a token here if needed (JWT)
    res.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        adminVerified: admin.adminVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
