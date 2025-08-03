const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $group: { _id: '$category.name', icon: { $first: '$category.icon' } } },
      { $project: { name: '$_id', icon: 1, _id: 0 } }
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create course
router.post('/', async (req, res) => {
  const course = new Course({
    title: req.body.title,
    instructor: req.body.instructor,
    instructorAvatar: req.body.instructorAvatar,
    image: req.body.image,
    lessons: req.body.lessons,
    duration: req.body.duration,
    price: req.body.price,
    originalPrice: req.body.originalPrice,
    isFree: req.body.isFree || false,
    category: req.body.category,
    tags: req.body.tags,
    level: req.body.level,
    videos: req.body.videos || [],
    reviews: req.body.reviews || [],
    enrolledUsers: req.body.enrolledUsers || [],
    description: req.body.description || [],
    courseVerified: req.body.courseVerified || false,
    editCourse: req.body.editCourse || true,
    instructorId: req.body.instructorId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Update fields if they exist in the request
    const updateFields = [
      'title', 'instructor', 'instructorAvatar', 'image', 'lessons', 'duration',
      'price', 'originalPrice', 'isFree', 'category', 'tags', 'level', 'videos',
      'reviews', 'enrolledUsers', 'description', 'courseVerified', 'editCourse', 'instructorId'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });
    
    course.updatedAt = new Date();
    
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $group: { _id: '$category.name', icon: { $first: '$category.icon' } } },
      { $project: { name: '$_id', icon: 1, _id: 0 } }
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;