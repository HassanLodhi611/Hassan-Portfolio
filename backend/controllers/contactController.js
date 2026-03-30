const Message = require('../models/Message');
const { sendContactEmail } = require('../config/email');

// POST /api/contact  (public)
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const msg = await Message.create({ name, email, subject, message });

    // Send email notifications in the background (don't wait)
    sendContactEmail(name, email, subject, message);

    // Return response immediately
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: msg });
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/contact  (admin)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/contact/:id/read  (admin)
const markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, getMessages, markRead };
