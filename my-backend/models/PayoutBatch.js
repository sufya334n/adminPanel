const mongoose = require('mongoose');

const payoutBatchSchema = new mongoose.Schema({
  paidPayoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaidPayout',
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
  totalPlatformCut: {
    type: Number,
    required: true,
  },
  payoutAt: {
    type: Date,
    default: Date.now,
  },
  items: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnpaidPayout',
  }],
});

module.exports = mongoose.model('PayoutBatch', payoutBatchSchema);