const mongoose = require('mongoose');

const paidPayoutSchema = new mongoose.Schema({
   instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
  unpaidIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnpaidPayout',
    required: true,
  }],
  amount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
  commissionRate: {
    type: Number,
    required: true,
  },
  instructorAmount: {
    type: Number,
    required: true,
  },
  platformCut: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('PaidPayout', paidPayoutSchema);

