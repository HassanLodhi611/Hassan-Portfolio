const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../config/cloudinary');

router.get('/', getAbout);
router.put('/', protect, uploadProfile.single('image'), updateAbout);

module.exports = router;
