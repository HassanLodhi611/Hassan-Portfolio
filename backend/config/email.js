const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionUrl: `smtps://${process.env.EMAIL_USER}:${process.env.EMAIL_PASS}@smtp.gmail.com`,
  connectionTimeout: 10000,
  socketTimeout: 10000,
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 2000,
    rateLimit: 5,
  },
});

// Non-blocking email sending (fire-and-forget)
const sendContactEmail = async (name, email, subject, message) => {
  // Send both emails asynchronously without waiting
  Promise.all([
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Message from Your Portfolio</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            Reply directly to ${email} or use your portfolio admin panel.
          </p>
        </div>
      `,
      timeout: 10000,
    }),
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Message Received - Hassan Lodhi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00FFC6;">Thank You for Reaching Out!</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p>Hi ${name},</p>
            <p>I've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6; background: white; padding: 10px; border-left: 3px solid #00FFC6;">${message}</p>
          </div>
          <p style="margin-top: 20px; color: #666;">
            Best regards,<br>
            <strong>Hassan Lodhi</strong><br>
            Full Stack Developer & Cybersecurity Enthusiast
          </p>
        </div>
      `,
      timeout: 10000,
    }),
  ]).catch((err) => {
    console.error('Background email sending failed:', err.message);
    // Silently fail - message was already saved to DB
  });

  // Return immediately - don't wait for emails
  return true;
};

module.exports = { sendContactEmail };
