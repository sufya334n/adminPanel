const express = require('express');
const router = express.Router();
const UnpaidPayout = require('../models/UnpaidPayout');
const PaidPayout = require('../models/PaidPayout');
const PayoutBatch = require('../models/PayoutBatch');
const Instructor = require('../models/Instructor');
const User = require('../models/User'); // Make sure to import User model
const mongoose = require('mongoose');

// const stripe = require('./stripe'); // helper import
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Course = require('../models/Course');

// Get unpaid payouts for a specific instructor
router.get('/unpaid/:instructorId', async (req, res) => {
  try {
    const unpaid = await UnpaidPayout.find({
      instructorId: req.params.instructorId,
      paid: false
    }).populate('courseId studentId');

    res.json(unpaid);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all unpaid payouts grouped by instructor (for admin dashboard)
// Get all unpaid payouts grouped by instructor (for admin dashboard)
router.get('/unpaid-summary', async (req, res) => {
  try {
    const unpaidPayouts = await UnpaidPayout.find({ paid: false })
      .populate('instructorId', 'name')
      .populate('courseId', 'title');
    const instructorMap = new Map();
    unpaidPayouts.forEach(payout => {
      const instId = payout.instructorId._id.toString();
      if (!instructorMap.has(instId)) {
        instructorMap.set(instId, {
          instructorId: payout.instructorId._id,
          instructorName: payout.instructorId.name,
          courseCount: 0,
          totalAmount: 0,
          status: 'Pending'
        });
      }
      const instData = instructorMap.get(instId);
      instData.courseCount += 1;
      instData.totalAmount += payout.amount;
    });
    const instructorSummary = Array.from(instructorMap.values());
    res.json(instructorSummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get detailed unpaid payouts for a specific instructor (for modal display)
router.get('/unpaid-details/:instructorId', async (req, res) => {
  try {
    const unpaidPayouts = await UnpaidPayout.find({
      instructorId: req.params.instructorId,
      paid: false
    })
    .populate('courseId', 'title')
    .populate('studentId', 'name email');
    
    // Get instructor commission rate
    const instructor = await Instructor.findById(req.params.instructorId);
    const commissionRate = instructor.commission || 70; // Default to 70% if not set
    
    // Calculate totals
    const totalAmount = unpaidPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const instructorAmount = (totalAmount * commissionRate) / 100;
    const platformCut = totalAmount - instructorAmount;
    
    res.json({
      payouts: unpaidPayouts,
      summary: {
        totalAmount,
        commissionRate,
        instructorAmount,
        platformCut
      },
      instructorName: instructor.name,        // 👈 add this
      stripeAccountId: instructor.stripeAccountId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// // Process payout for an instructor
// router.post('/process/:instructorId', async (req, res) => {

// Get total sales and platform profit for analytics dashboard
// router.get('/summary', async (req, res) => {
//   try {
//     const { range } = req.query;
//     let paidPayoutFilter = {};
//     let unpaidPayoutFilter = {};
//     const now = new Date();

//     // Date filtering logic for paid payouts
//     switch (range) {
//       case 'monthly':
//         paidPayoutFilter = { paidAt: { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)) } };
//         unpaidPayoutFilter = { createdAt: { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)) } }; // Assuming UnpaidPayout has createdAt
//         break;
//       case 'weekly':
//         const dayOfWeek = now.getUTCDay(); // 0 for Sunday, 1 for Monday
//         const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday being 0
//         paidPayoutFilter = { paidAt: { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff)) } };
//         unpaidPayoutFilter = { createdAt: { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff)) } };
//         break;
//       case 'daily':
//         paidPayoutFilter = { paidAt: { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) } };
//         unpaidPayoutFilter = { createdAt: { $gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) } };
//         break;
//       case 'all':
//       default:
//         paidPayoutFilter = {}; // No date filter for 'all' or invalid range
//         unpaidPayoutFilter = {};
//         break;
//     }

//     // Calculate total paid payouts
//     const paidPayouts = await PaidPayout.find(paidPayoutFilter);
//     const totalPaidPayouts = paidPayouts.reduce((sum, payout) => sum + payout.amount, 0);

//     // Calculate total unpaid payouts (instructor's share)
//     const unpaidPayouts = await UnpaidPayout.find(unpaidPayoutFilter).populate('instructorId');
//     let totalUnpaidPayouts = 0;
//     unpaidPayouts.forEach(payout => {
//       if (payout.instructorId) {
//         const commissionRate = payout.instructorId.commission || 70; // Default to 70%
//         totalUnpaidPayouts += (payout.amount * commissionRate) / 100;
//       }
//     });

//     res.json({
//       totalPaidPayouts: totalPaidPayouts,
//       totalUnpaidPayouts: totalUnpaidPayouts,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




router.get('/summary', async (req, res) => {
  try {
    const { range } = req.query;
    let startDate = null;

    const now = moment.utc();

    // Set start date based on range
    switch (range) {
      case 'monthly':
        startDate = now.clone().startOf('month');
        break;
      case 'weekly':
        startDate = now.clone().startOf('isoWeek');
        break;
      case 'daily':
        startDate = now.clone().startOf('day');
        break;
    }

    // 1️⃣ Total Collected from Users (Aggregation Filter on paidAt)
    let matchStage = {};
    if (startDate) {
      matchStage = { 'paymentHistory.paidAt': { $gte: startDate.toDate() } };
    }

    const collectedResult = await User.aggregate([
      { $unwind: '$paymentHistory' },
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$paymentHistory.amount' } } }
    ]);

    const totalCollected = (collectedResult[0]?.total || 0) / 100; // cents → dollars

    // 2️⃣ Total Paid Payouts
    const paidPayoutFilter = startDate ? { paidAt: { $gte: startDate.toDate() } } : {};
    const paidPayouts = await PaidPayout.find(paidPayoutFilter);
    const totalPaidPayouts = paidPayouts.reduce((sum, p) => sum + (p.instructorAmount || 0), 0);

    // 3️⃣ Total Unpaid Payouts
    const unpaidPayoutFilter = startDate ? { createdAt: { $gte: startDate.toDate() } } : {};
    const unpaidPayouts = await UnpaidPayout.find(unpaidPayoutFilter).populate('instructorId');
    let totalUnpaidPayouts = 0;
    unpaidPayouts.forEach(p => {
      const commission = p.instructorId?.commission || 70;
      totalUnpaidPayouts += (p.amount || 0) * (commission / 100);
    });

    // 4️⃣ Platform Profit
    const platformProfit = totalCollected - totalPaidPayouts - totalUnpaidPayouts;

    res.json({
      totalCollected,
      totalPaidPayouts,
      totalUnpaidPayouts,
      platformProfit
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


























//   try {
//     const instructorId = req.params.instructorId;
    
//     // Get all unpaid payouts for this instructor
//     const unpaidPayouts = await UnpaidPayout.find({
//       instructorId,
//       paid: false
//     });
    
//     if (unpaidPayouts.length === 0) {
//       return res.status(404).json({ error: 'No unpaid payouts found for this instructor' });
//     }
    
//     // Get instructor commission rate
//     const instructor = await Instructor.findById(instructorId);
//     const commissionRate = instructor.commission || 70; // Default to 70% if not set
    
//     // Calculate totals
//     const totalAmount = unpaidPayouts.reduce((sum, payout) => sum + payout.amount, 0);
//     const instructorAmount = (totalAmount * commissionRate) / 100;
//     const platformCut = totalAmount - instructorAmount;
    
//     // Create a new PaidPayout record
//     const paidPayout = new PaidPayout({
//       unpaidIds: unpaidPayouts.map(payout => payout._id),
//       amount: totalAmount,
//       commissionRate,
//       instructorAmount,
//       platformCut
//     });
    
//     const savedPaidPayout = await paidPayout.save();
    
//     // Create a PayoutBatch record
//     const payoutBatch = new PayoutBatch({
//       paidPayoutId: savedPaidPayout._id,
//       instructorId,
//       totalPlatformCut: platformCut,
//       items: unpaidPayouts.map(payout => payout._id)
//     });
    
//     await payoutBatch.save();
    
//     // Update all unpaid payouts to paid=true
//     await UnpaidPayout.updateMany(
//       { _id: { $in: unpaidPayouts.map(payout => payout._id) } },
//       { paid: true }
//     );
    
//     res.json({
//       success: true,
//       paidPayout: savedPaidPayout,
//       payoutBatch
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// Process payout route
router.post('/process/:instructorId', async (req, res) => {
  const instructorId = req.params.instructorId;
  const unpaidList = await UnpaidPayout.find({ instructorId, paid: false });
  const instructor = await Instructor.findById(instructorId);
  const accountNo = instructor.accountNumber;
  const commissionRate = instructor.commission || 70;

  const totalAmount = unpaidList.reduce((sum, p) => sum + p.amount, 0);
  const instructorAmount = Math.floor((totalAmount * commissionRate) / 100 * 100) / 100; // round cents
  const platformCut = totalAmount - instructorAmount;

  // Create Stripe transfer
  const transfer = await stripe.transfers.create({
    amount: Math.round(instructorAmount * 100), // in cents
    currency: 'usd',
    destination: instructor.stripeAccountId, // mapped from instructor
    description: `Payout to instructor ${instructorId}`,
  });

  // Record paid payout
  const paid = await PaidPayout.create({
    instructorId,
    unpaidIds: unpaidList.map(u => u._id),
    amount: totalAmount,
    commissionRate,
    instructorAmount,
    platformCut,
    paymentId: transfer.id,
  });

  // Create batch
  await PayoutBatch.create({
    paidPayoutId: paid._id,
    instructorId,
    totalPlatformCut: platformCut,
    items: unpaidList.map(u => u._id),
    payoutAt: new Date(),
  });

  // Mark unpaid records as paid
  await UnpaidPayout.updateMany({ _id: { $in: unpaidList.map(u=>u._id) } }, { paid: true });

  res.json({
    instructorName: instructor.name,
    accountNumber: accountNo,
    totalAmount,
    commissionRate,
    instructorAmount,
    platformCut,
    paymentId: transfer.id,
  });
});


// Get all paid payouts history
// router.get('/paid', async (req, res) => {
//   try {
//     const paidPayouts = await PaidPayout.find()
//       .populate({
//         path: 'unpaidIds',
//         populate: [
//           { path: 'instructorId', select: 'name' },
//           { path: 'courseId', select: 'title' }
//         ]
//       });
    
//     res.json(paidPayouts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.get('/paid', async (req, res) => {
  try {
    const paidPayouts = await PaidPayout.find()
      .populate({
        path: 'unpaidIds',
        populate: [
          { path: 'instructorId', select: 'name email' },
          { path: 'courseId', select: 'title' },
          { path: 'studentId', select: 'name email' }
        ]
      })
      .sort({ paidAt: -1 });
    
    const formattedPayouts = paidPayouts.map(payout => ({
      _id: payout._id,
      instructorName: payout.unpaidIds[0]?.instructorId?.name || 'Unknown',
      instructorEmail: payout.unpaidIds[0]?.instructorId?.email || '',
      totalAmount: payout.amount,
      instructorAmount: payout.instructorAmount,
      platformCut: payout.platformCut,
      paidAt: payout.paidAt,
      commissionRate: payout.commissionRate,
      transactions: payout.unpaidIds.map(unpaid => ({
        studentName: unpaid.studentId?.name || 'Unknown',
        studentEmail: unpaid.studentId?.email || '',
        courseName: unpaid.courseId?.title || 'Unknown Course',
        amount: unpaid.amount,
        date: unpaid.createdAt
      }))
    }));

    res.json(formattedPayouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});










// // Get payout batches for an instructor
// router.get('/batches/:instructorId', async (req, res) => {
//   try {
//     const batches = await PayoutBatch.find({ instructorId: req.params.instructorId })
//       .populate('paidPayoutId')
//       .sort({ payoutAt: -1 });
    
//     res.json(batches);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// Enhanced payout batches endpoint

// Get ALL payout batches (admin)
router.get('/batches', async (req, res) => {
  try {
    const batches = await PayoutBatch.find()
      .populate([
        {
          path: 'paidPayoutId',
          populate: {
            path: 'unpaidIds',
            populate: [
              { path: 'studentId', select: 'name email' },
              { path: 'courseId', select: 'title' },
            ],
          },
        },
        { path: 'instructorId', select: 'name email' },
      ])
      .sort({ payoutAt: -1 });

    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payout batches for a specific instructor

router.get('/batches/instructor/:instructorId', async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ error: 'Invalid instructor ID format' });
    }

    const batches = await PayoutBatch.find({ instructorId })
      .populate([
        {
          path: 'paidPayoutId',
          populate: {
            path: 'unpaidIds',
            populate: [
              { path: 'studentId', select: 'name email' },
              { path: 'courseId', select: 'title' },
            ],
          },
        },
        { path: 'instructorId', select: 'name email' },
      ])
      .sort({ payoutAt: -1 });

    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






router.get('/all-payment-history', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email paymentHistory')
      .populate({
        path: 'paymentHistory.courseId',
        select: 'title', // Make sure this matches your Course model
        model: 'Course' // This should be your Course model name
      });

    const allPayments = users.flatMap(user => 
      user.paymentHistory.map(payment => ({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        courseId: payment.courseId?._id,
        courseName: payment.courseId?.title || 'No Course Name', // Fallback if null
        amount: payment.amount/100,
        paymentId: payment.paymentId,
        status: payment.status,
        date: payment.date
      }))
    );

    res.json({
      success: true,
      payments: allPayments
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payment history',
      error: err.message 
    });
  }
});













const moment = require('moment');

// router.get('/summary', async (req, res) => {
//   const { range = 'all' } = req.query;

//   try {
//     let startDate;
//     if (range === 'daily') {
//       startDate = moment().startOf('day');
//     } else if (range === 'weekly') {
//       startDate = moment().startOf('isoWeek');
//     } else if (range === 'monthly') {
//       startDate = moment().startOf('month');
//     }

//     // 1. Total collected payments from users
//     const users = await User.find({}).select('paymentHistory');

//     let totalCollected = 0;

//     users.forEach(user => {
//       user.paymentHistory.forEach(payment => {
//         if (!startDate || moment(payment.date).isSameOrAfter(startDate)) {
//           totalCollected += payment.amount || 0;
//         }
//       });
//     });

//     // 2. Pending payouts to instructors
//     const unpaidFilter = startDate ? { paid: false, createdAt: { $gte: startDate.toDate() } } : { paid: false };
//     const unpaidPayouts = await UnpaidPayout.find(unpaidFilter);

//     const totalUnpaid = unpaidPayouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);

//     // 3. Paid payouts to instructors
//     const paidFilter = startDate ? { createdAt: { $gte: startDate.toDate() } } : {};
//     const paidPayouts = await PaidPayout.find(paidFilter);

//     const totalPaidToInstructors = paidPayouts.reduce((sum, payout) => sum + (payout.instructorAmount || 0), 0);

//     // 4. Platform profit = total collected - total instructor cost (paid + unpaid)
//     const platformProfit = totalCollected/100 - totalPaidToInstructors - totalUnpaid;

//     res.json({
//       totalCollected,
//       totalPaidToInstructors,
//       totalUnpaid,
//       platformProfit
//     });

//   } catch (err) {
//     console.error("Summary error:", err);
//     res.status(500).json({ error: 'Failed to fetch payout summary' });
//   }
// });






// router.get('/summary', async (req, res) => {
//   const { range = 'all' } = req.query;

//   try {
//     let startDate;
//     if (range === 'daily') {
//       startDate = moment().startOf('day');
//     } else if (range === 'weekly') {
//       startDate = moment().startOf('isoWeek');
//     } else if (range === 'monthly') {
//       startDate = moment().startOf('month');
//     }

//     // === 1. Total Collected from Users ===
//     const users = await User.find({}).select('paymentHistory');
//     let totalCollected = 0;

//     users.forEach(user => {
//       user.paymentHistory.forEach(payment => {
//         if (!startDate || moment(payment.paidAt).isSameOrAfter(startDate)) {
//           totalCollected += payment.amount || 0;
//         }
//       });
//     });

//     // === 2. Unpaid Payouts ===
//     const unpaidFilter = startDate
//       ? { paid: false, createdAt: { $gte: startDate.toDate() } }
//       : { paid: false };

//     const unpaidPayouts = await UnpaidPayout.find(unpaidFilter);
//     const totalUnpaid = unpaidPayouts.reduce(
//       (sum, p) => sum + (p.amount || 0),
//       0
//     );

//     // === 3. Paid Payouts (✅ filter by `paidAt`) ===
//     const paidFilter = startDate
//       ? { paidAt: { $gte: startDate.toDate() } }
//       : {};

//     const paidPayouts = await PaidPayout.find(paidFilter);
//     const totalPaidToInstructors = paidPayouts.reduce(
//       (sum, p) => sum + (p.instructorAmount || 0),
//       0
//     );

//     // === 4. Platform Profit ===
//     const total=totalCollected/100;
//     const platformProfit =
//       total - totalPaidToInstructors - totalUnpaid;

//     res.json({
//       total,
//       totalPaidToInstructors,
//       totalUnpaid,
//       platformProfit
//     });

//   } catch (err) {
//     console.error("Summary error:", err);
//     res.status(500).json({ error: 'Failed to fetch payout summary' });
//   }
// });





router.get('/summary', async (req, res) => {
  const { range = 'all' } = req.query;

  try {
    let startDate = null;
    let endDate = null;

    // === Determine Date Range ===
    if (range === 'daily') {
      startDate = moment().startOf('day');
      endDate = moment().endOf('day');
    } else if (range === 'weekly') {
      startDate = moment().startOf('isoWeek');
      endDate = moment().endOf('isoWeek');
    } else if (range === 'monthly') {
      startDate = moment().startOf('month');
      endDate = moment().endOf('month');
    }

    console.log(`📅 Range: ${range}`);
    if (startDate && endDate) {
      console.log("🔹 Start Date:", startDate.toISOString());
      console.log("🔹 End Date:", endDate.toISOString());
    }

    // === 1. Total Collected from Users ===
    const users = await User.find({}).select('paymentHistory');
    let totalCollected = 0;

    users.forEach(user => {
      user.paymentHistory.forEach(payment => {
        const paidAt = moment(payment.paidAt);
        const isInRange = !startDate || paidAt.isBetween(startDate, endDate, null, '[]');

        if (isInRange) {
          totalCollected += payment.amount || 0;
        }
      });
    });

    // === 2. Unpaid Payouts (Adjusted by Commission) ===
    const unpaidFilter = startDate && endDate
      ? {
          paid: false,
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
        }
      : { paid: false };

    const unpaidPayouts = await UnpaidPayout.find(unpaidFilter);

    const instructorIds = [...new Set(unpaidPayouts.map(p => p.instructorId.toString()))];
    const instructors = await Instructor.find({ _id: { $in: instructorIds } }).select('commission');
    const commissionMap = new Map(instructors.map(i => [i._id.toString(), i.commission]));

    let totalUnpaid = 0;
    for (const payout of unpaidPayouts) {
      const commission = commissionMap.get(payout.instructorId.toString()) || 0;
      const instructorShare = (payout.amount || 0) * (commission / 100);
      totalUnpaid += instructorShare;
    }

    // === 3. Paid Payouts ===
    const paidFilter = startDate && endDate
      ? {
          paidAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
        }
      : {};

    const paidPayouts = await PaidPayout.find(paidFilter);
    const totalPaidToInstructors = paidPayouts.reduce(
      (sum, p) => sum + (p.instructorAmount || 0),
      0
    );

    // === 4. Platform Profit Calculation ===
    const total = totalCollected / 100;  // If you store in cents
    const platformProfit = total - totalPaidToInstructors - totalUnpaid;

    // === 5. Response ===
    res.json({
      total,
      totalPaidToInstructors,
      totalUnpaid,
      platformProfit
    });

  } catch (err) {
    console.error("❌ Summary error:", err);
    res.status(500).json({ error: 'Failed to fetch payout summary' });
  }
});










router.get('/count', async (req, res) => {
  try {
    console.log('Counting users...');
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    console.log('Users counted:', { totalUsers, activeUsers });
    res.json({ totalUsers, activeUsers });
  } catch (err) {
    console.error('Error in /count:', err);
    res.status(500).json({ error: err.message });
  }
});

// Then dynamic routes after
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;