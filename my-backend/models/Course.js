const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  instructorAvatar: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/800x400'
  },
  lessons: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  category: {
  name: { type: String, required: true },
  icon: { type: String }
},

  tags: {
    type: [String],
    default: []
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  videos: [{
    title: String,
    url: String
  }],
  reviews: [{
    user: String,
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  enrolledUsers: [{
    type: String
  }],

  description: [{
    heading: String,
    details: [String]
  }],
  courseVerified: {
    type: Boolean,
    default: false
  },
  editCourse: {
    type: Boolean,
    default: true
  },
  instructorId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);