const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Non-blocking email sending (fire-and-forget)
const sendContactEmail = async (name, email, subject, message) => {
  try {
    // Send to yourself
    await resend.emails.send({
      from: 'Hassan Lodhi <onboarding@resend.dev>',
       to: "hassanlodhi261@gmail.com",
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
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Hassan Lodhi <onboarding@resend.dev>',
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
    });
  } catch (err) {
    console.error('Resend email error:', err);
  }
  return true;
};

module.exports = { sendContactEmail };
