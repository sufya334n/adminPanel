// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const userCoursesRoutes = require('./routes/userRoutes');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });



// // Mount the route at /api
// app.use('/api', userCoursesRoutes);
// // Routes
// app.use('/api/blogs', require('./routes/blogRoutes'));
// app.use('/api/courses', require('./routes/courseRoutes')); // کورسز روٹس شامل کیے
// app.use('/api/users', require('./routes/userRoutes')); // یوزر روٹس شامل کیے
// app.use('/api/instructors', require('./routes/instructorRoutes')); // انسٹرکٹر روٹس شامل کیے


// // Basic route for testing
// app.get('/api', (req, res) => {
//   res.json({ message: 'API is working!' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







require('dotenv').config(); // should be at the very top

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


// Routes
const blogRoutes = require('./routes/blogRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');  // Make sure this path is correct
const instructorRoutes = require('./routes/instructorRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes'); // New route added
const contactRoutes = require('./routes/contactRoutes'); // New route added
const aboutRoutes = require('./routes/aboutRoutes'); // New about routes
const authRoutes = require('./routes/auth');
const payoutRoutes = require('./routes/payouts'); // New payout routes
// const uploadRoute = require("./routes/uploadRoute");

// const analytics=require('./routes/userRoutes')


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Mount Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);  // This must be '/api/users'
app.use('/api/instructors', instructorRoutes);
app.use('/api/contactinfo', contactInfoRoutes); // New route mounted
app.use('/api/contacts', contactRoutes); // New route mounted
app.use('/api/about', aboutRoutes); 

app.use('/api', authRoutes);
app.use('/api/payouts', payoutRoutes); // New payout routes mounted
// app.use("/api/upload", uploadRoute);




// Test route for basic verification
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
