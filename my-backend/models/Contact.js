const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isReplied: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Contact', contactSchema);