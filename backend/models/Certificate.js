const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certificate name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
      maxlength: [100, 'Issuer cannot exceed 100 characters'],
    },
    date: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      default: '🎓',
      maxlength: 4,
    },
    verifyUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', CertificateSchema);
