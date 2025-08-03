const nodemailer = require('nodemailer'); 
 
// Create a transporter object using SMTP transport 
const transporter = nodemailer.createTransport({ 
  service: 'Gmail', 
  auth: { 
    user: process.env.EMAIL_USER, // Admin ka Gmail address .env file se 
    pass: process.env.EMAIL_PASS  // Gmail app password .env file se 
  } 
}); 

// Function to send email 
const sendEmail = async (to, subject, html) => { 
  try { 
    const mailOptions = { 
      from: process.env.EMAIL_USER, // Sender (admin) email 
      to,                          // Receiver email 
      subject,                     // Email subject 
      html                         // Email content (HTML format) 
    }; 

    const info = await transporter.sendMail(mailOptions); 
    console.log('Email sent:', info.response); 
    return info; 
  } catch (error) { 
    console.error('Error sending email:', error); 
    throw error; 
  } 
}; 

module.exports = { sendEmail }; 