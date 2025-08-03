const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verifiedInstructor: {
    type: Boolean,
    default: false
  },
  instructorAvatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=Instructor'
  },
  bio: {
    type: String,
    default: ''
  },
  commission: {
     type: Number,
     default: 70
     },  // Commission percentage (Admin editable)
  accountNumber: String, 
 stripeAccountId: { type: String }, // ✅ REQUIRED for Stripe transfers!  
  expertise: [{
    type: String
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Instructor', instructorSchema);