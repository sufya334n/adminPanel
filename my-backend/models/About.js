const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    default: 'About Us'
  },
  whoWeAre: {
    type: String,
    required: true,
    default: 'We are a passionate team of educators, developers, designers, and field experts.'
  },
  vision: {
    type: String,
    required: true,
    default: 'To create a future where anyone with curiosity and commitment can gain knowledge and skills.'
  },
  visionImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1568678473562-4d6d0b2386c0?w=500'
  },
  mission: {
    type: String,
    required: true,
    default: 'Learn. Grow. Succeed. We\'re committed to helping learners build job-ready skills.'
  },
  missionImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1465145318356-7c9b5b9c5e30?w=500'
  },
  whatMakesUsDifferent: {
    type: Array,
    default: [
      'Learn from Experts: Our courses are created and delivered by industry leaders',
      'Project-Based Learning: We don\'t just teach theory - we help you apply',
      'Beginner to Advanced: We welcome learners at all skill levels',
      'Affordable & Flexible: We believe high-quality education shouldn\'t cost a fortune',
      'Global & Inclusive: Our content is aligned with international standards'
    ]
  },
  whatMakesUsDifferentImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400'
  },
  whoCanBenefitImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400'
  },
  
//   whoCanBenefitSubtitle: {
//     type: Array,
//     default: [
//       'Professionals upgrading their skills',
//       'Freelancers looking to boost their income',
//       'Job seekers preparing for future careers',
//       'Entrepreneurs who want to learn how to build and grow a business',
//       'Teachers and institutions who want to bring digital learning to their students'
//     ]
//   },

  technologies: {
    type: Array,
    default: [
      'Frontend Development (JavaScript, HTML, CSS, React)',
      'Web & App Development (HTML, CSS, Flutter, React)',
      'Data Science & AI',
      'Freelancing Skills & Portfolio Building',
      'Graphics & Entrepreneurship',
      'Creative & Technical Writing',
      'Career Development & Soft Skills'
    ]
  },
  technologiesImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500'
  },
  commitment: {
    type: String,
    default: 'At [Your Platform Name], we\'re not just building a product - we\'re building a community of lifelong learners.'
  },
  commitmentImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500'
  },
  whoWeAreImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400'
  },

  contact: {
    email: {
      type: String,
      default: 'your-email@example.com'
    },
    website: {
      type: String,
      default: 'yourwebsite.com'
    },
   
  },
  
}, { timestamps: true });

const About = mongoose.model('About', aboutSchema);

module.exports = About;