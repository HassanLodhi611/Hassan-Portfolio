const express = require('express');
const router = express.Router();
const { login, verify, changeCredentials } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', protect, verify);
router.put('/change-credentials', protect, changeCredentials);

module.exports = router;
