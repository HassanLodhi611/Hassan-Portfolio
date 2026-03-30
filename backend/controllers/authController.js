const jwt = require('jsonwebtoken');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin', username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      admin: { username, role: 'admin' },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/verify
const verify = async (req, res) => {
  // req.admin is populated by the protect middleware
  res.json({ success: true, admin: req.admin });
};

// PUT /api/auth/change-credentials (admin only)
const changeCredentials = async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    // Verify current password
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Validate new password if provided
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'Password must have uppercase letter' });
      }
      if (!/[a-z]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'Password must have lowercase letter' });
      }
      if (!/[0-9]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'Password must have number' });
      }
      if (!/[!@#$%^&*]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'Password must have special character (!@#$%^&*)' });
      }
    }

    // Note: In production, store credentials securely (e.g., in database with hashing)
    // This is a simple implementation updating env variables
    if (newUsername) {
      process.env.ADMIN_USERNAME = newUsername;
    }
    if (newPassword) {
      process.env.ADMIN_PASSWORD = newPassword;
    }

    res.json({
      success: true,
      message: 'Credentials updated successfully. Please login again with new credentials.',
      admin: { username: newUsername || process.env.ADMIN_USERNAME, role: 'admin' },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, verify, changeCredentials };
