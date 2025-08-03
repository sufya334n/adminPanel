const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ... existing code ...

// Create blog
router.post('/', async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt,
    image: req.body.image,
    category: req.body.category,
    tags: req.body.tags,
    author: req.body.author,
    date: req.body.date || new Date(), // اگر date نہیں دی گئی تو آج کی تاریخ استعمال کریں
    views: 0, // ہمیشہ views کو 0 سیٹ کریں
    isPublished: req.body.isPublished || false
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... existing code ...
// Update blog
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) blog.content = req.body.content;
    if (req.body.excerpt) blog.excerpt = req.body.excerpt;
    if (req.body.image) blog.image = req.body.image;
    if (req.body.category) blog.category = req.body.category;
    if (req.body.tags) blog.tags = req.body.tags;
    if (req.body.author) blog.author = req.body.author;
    if (req.body.date) blog.date = req.body.date;
    if (req.body.views !== undefined) blog.views = req.body.views;
    if (req.body.isPublished !== undefined) blog.isPublished = req.body.isPublished;
    
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    await blog.deleteOne(); // .remove() is deprecated
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;







