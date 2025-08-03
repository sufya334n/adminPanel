const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const mongoose = require('mongoose');
// Get total sales from payment history
router.get('/analytics/sales', async (req, res) => {
  try {
    const { range } = req.query;
    const now = new Date();
    let matchQuery = {};

    switch (range) {
      case 'monthly':
        matchQuery = { 'paymentHistory.paidAt': { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)) } };
        break;
      case 'weekly':
        const dayOfWeek = now.getUTCDay(); // 0 for Sunday, 1 for Monday
        const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday being 0
        matchQuery = { 'paymentHistory.paidAt': { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff)) } };
        break;
      case 'daily':
        matchQuery = { 'paymentHistory.paidAt': { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) }};
        break;
      case 'all':
      default:
        // No date filter for 'all' or invalid range
        break;
    }

    const result = await User.aggregate([
      { $unwind: '$paymentHistory' },
      { $match: matchQuery },
      { $group: { _id: null, totalSales: { $sum: '$paymentHistory.amount' } } }
    ]);

    res.json({ totalSales: result.length > 0 ? result[0].totalSales : 0 });
  } catch (error) {
    console.error('Error fetching total sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.lastActive = new Date();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get user's enrolled courses

// Get enrolled courses by user ID

// Get Enrolled Courses by User ID
// Backend Route - enrolled-courses
router.get('/:userId/enrolled-courses', async (req, res) => {
  const { userId } = req.params;  // User ID parameter
  try {
    const enrolledCourses = await Course.find({ enrolledUsers: userId });  // Querying courses by userId
    res.status(200).json(enrolledCourses);  // Returning enrolled courses
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
});


// Get Completed Courses by User ID
// Get Completed Courses by User ID
// Get Completed Courses by User ID
// Get Completed Courses by User ID
// Get Completed Courses by User ID

// ✅ Route 1: Get completed courses
router.get('/:userId/completed-courses', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const courseIds = user.completedCourses.map(c => c.courseId);
    const completedCourses = await Course.find({ _id: { $in: courseIds } });

    res.status(200).json(completedCourses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching completed courses', error: err.message });
  }
});

// ✅ Route 2: Get purchased courses
router.get('/:userId/purchased-courses', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const courseIds = user.purchasedCourses.map(c => c.courseId);
    const purchasedCourses = await Course.find({ _id: { $in: courseIds } });

    res.status(200).json(purchasedCourses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchased courses', error: err.message });
  }
});






// router.get('/:userId/purchased-courses', async (req, res) => {
//   const { userId } = req.params;  // User ka ID
//   try {
//     const purchasedCourses = await Course.find({ purchasedBy: userId });  // Purchased courses query
//     res.status(200).json(purchasedCourses);  // Send purchased courses
//   } catch (error) {
//     console.error('Error fetching purchased courses:', error);
//     res.status(500).json({ message: 'Error fetching purchased courses', error: error.message });
//   }
// });


// Get user's payment history









router.get('/:id/payment-history', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('paymentHistory.courseId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.paymentHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone || '',
    avatar: req.body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}`,
    enrolledCourses: req.body.enrolledCourses || [],
    completedCourses: req.body.completedCourses || [],
    purchasedCourses: req.body.purchasedCourses || [],
    paymentHistory: req.body.paymentHistory || [],
    isBlocked: req.body.isBlocked || false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Update fields if they exist in the request
    const updateFields = [
      'name', 'email', 'password', 'phone', 'avatar', 'enrolledCourses',
      'completedCourses', 'purchasedCourses', 'paymentHistory', 'isBlocked'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    
    user.updatedAt = new Date();
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Block/Unblock user
router.patch('/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isBlocked = !user.isBlocked;
    user.updatedAt = new Date();
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get total and active users
router.get('/analytics/users', async (req, res) => {
  try {
    const { range } = req.query;
    let activeUsersQuery = {};
    const now = new Date();

    switch (range) {
      case 'monthly':
        activeUsersQuery = { lastActive: { $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()) } };
        break;
      case 'weekly':
        activeUsersQuery = { lastActive: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7) } };
        break;
      case 'daily':
        activeUsersQuery = { lastActive: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } };
        break;
      case 'all':
      default:
        activeUsersQuery = { lastActive: { $ne: null } }; // All users who have been active at least once
        break;
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments(activeUsersQuery);
    res.json({ totalUsers, activeUsers });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user last active time
router.put('/:id/last-active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.lastActive = new Date();
    await user.save();

    res.json({ message: 'Last active time updated successfully' });
  } catch (error) {
    console.error('Error updating last active time:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;




