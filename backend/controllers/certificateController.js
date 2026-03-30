const Certificate = require('../models/Certificate');
const { cloudinary } = require('../config/cloudinary');

// GET /api/certificates  (public)
const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/certificates/:id  (public)
const getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/certificates  (admin)
const createCertificate = async (req, res) => {
  try {
    const { name, issuer, date, icon, verifyUrl, order } = req.body;

    const certData = {
      name,
      issuer,
      date: date || '',
      icon: icon || '🎓',
      verifyUrl: verifyUrl || '',
      order: order ? parseInt(order) : 0,
    };

    if (req.file) {
      const imageUrl = req.file.path || req.file.location || '';
      const publicId = req.file.filename || req.file.public_id || '';
      if (imageUrl) {
        certData.image = { url: imageUrl, publicId };
      }
    }

    const cert = await Certificate.create(certData);
    res.status(201).json({ success: true, data: cert });
  } catch (err) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/certificates/:id  (admin)
const updateCertificate = async (req, res) => {
  try {
    const existing = await Certificate.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Certificate not found' });

    const { name, issuer, date, icon, verifyUrl, order } = req.body;

    const updateData = {
      ...(name      && { name }),
      ...(issuer    && { issuer }),
      ...(date      !== undefined && { date }),
      ...(icon      && { icon }),
      ...(verifyUrl !== undefined && { verifyUrl }),
      ...(order     !== undefined && { order: parseInt(order) }),
    };

    if (req.file) {
      if (existing.image?.publicId) {
        await cloudinary.uploader.destroy(existing.image.publicId).catch(() => {});
      }

      const imageUrl = req.file.path || req.file.location || '';
      const publicId = req.file.filename || req.file.public_id || '';
      if (imageUrl) {
        updateData.image = { url: imageUrl, publicId };
      }
    }

    const cert = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/certificates/:id  (admin)
const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    if (cert.image?.publicId) {
      await cloudinary.uploader.destroy(cert.image.publicId).catch(() => {});
    }

    await cert.deleteOne();
    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCertificates, getCertificate, createCertificate, updateCertificate, deleteCertificate };
