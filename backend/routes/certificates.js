const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const { uploadCert } = require('../config/cloudinary');

router.get('/',    getCertificates);
router.get('/:id', getCertificate);

router.post('/',      protect, uploadCert.single('image'), createCertificate);
router.put('/:id',    protect, uploadCert.single('image'), updateCertificate);
router.delete('/:id', protect, deleteCertificate);

module.exports = router;
