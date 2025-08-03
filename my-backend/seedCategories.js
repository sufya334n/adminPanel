// forceSeedCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

// ✅ Your custom category (hardcoded for every course)
const fixedCategory = {
  name: "Web Development",
  icon: "https://cdn-icons-png.flaticon.com/512/2721/2721297.png"
};

async function updateAllCoursesCategory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const courses = await Course.find();

    for (const course of courses) {
      course.category = fixedCategory;
      await course.save();
      console.log(`🔁 Updated course "${course.title}"`);
    }

    console.log('✅ All course categories updated');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateAllCoursesCategory();
