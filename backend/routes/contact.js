const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markRead } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', sendMessage);

router.get('/',             protect, getMessages);
router.patch('/:id/read',   protect, markRead);

module.exports = router;
