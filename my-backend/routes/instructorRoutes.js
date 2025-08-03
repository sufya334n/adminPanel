const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const Course = require('../models/Course');

// Get all instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one instructor
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create instructor
router.post('/', async (req, res) => {
  const instructor = new Instructor({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    verifiedInstructor: req.body.verifiedInstructor || false,
    instructorAvatar: req.body.instructorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}`,
    bio: req.body.bio || '',
    commission: req.body.commission || 70,
    stripeAccountId: req.body.stripeAccountId || '',
    expertise: req.body.expertise || [],
    courses: req.body.courses || [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    const newInstructor = await instructor.save();
    res.status(201).json(newInstructor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update instructor
router.put('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    
    // Update fields if they exist in the request
    const updateFields = [
      'name', 'email', 'password', 'verifiedInstructor', 'instructorAvatar',
      'bio', 'expertise', 'courses', 'commission', 'stripeAccountId'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        instructor[field] = req.body[field];
      }
    });
    
    instructor.updatedAt = new Date();
    
    const updatedInstructor = await instructor.save();
    res.json(updatedInstructor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete instructor
router.delete('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    
    await instructor.deleteOne();
    res.json({ message: 'Instructor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/Disapprove instructor
router.patch('/:id/verify', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    
    instructor.verifiedInstructor = !instructor.verifiedInstructor;
    instructor.updatedAt = new Date();
    
    const updatedInstructor = await instructor.save();
    res.json(updatedInstructor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// // GET /api/instructors/:id/courses
router.get('/:id/courses', async (req, res) => {
  try {
    const instructorId = req.params.id;
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    
    const courses = await Course.find({
      $or: [
        { instructorId: instructorId },
        { instructor: instructor.name }
      ]
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

module.exports = router;