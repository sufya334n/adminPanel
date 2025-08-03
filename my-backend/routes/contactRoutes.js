const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendEmail } = require('../models/emailConfig'); // Import email utility

// Get all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one contact message
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new contact message
router.post('/', async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Reply to a contact message and send email
router.post('/:id/reply', async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    if (!replyMessage) {
      return res.status(400).json({ message: 'Reply message is required' });
    }
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    
    // Send email reply
    await sendEmail(
      contact.email,
      'Reply to your contact message',
      `<div>
        <p>Dear ${contact.name},</p>
        <p>Thank you for contacting us. Here is our response to your message:</p>
        <p><strong>Your original message:</strong> ${contact.message}</p>
        <p><strong>Our reply:</strong> ${replyMessage}</p>
        <p>Best regards,<br>Admin Team</p>
      </div>`
    );
    
    // Mark as replied in database
    contact.isReplied = true;
    contact.repliedAt = Date.now();
    
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (err) {
    console.error('Error replying to contact:', err);
    res.status(500).json({ message: err.message });
  }
});

// Mark as replied (without sending email)
router.patch('/:id/reply', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    
    contact.isReplied = true;
    contact.repliedAt = Date.now();
    
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a contact message
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    
    await Contact.deleteOne({ _id: req.params.id });
    res.json({ message: 'Contact message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;