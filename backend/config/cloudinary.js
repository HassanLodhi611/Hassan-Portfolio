const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Project image storage ────────────────────────
const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hassan-portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 450, crop: 'fill', quality: 'auto' }],
  },
});

// ─── Certificate image storage ────────────────────
const certStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hassan-portfolio/certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 400, crop: 'fill', quality: 'auto' }],
  },
});

// ─── About / profile photo storage ───────────────
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hassan-portfolio/profile',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1024, height: 1024, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image');
    err.message = 'Only image files are allowed';
    cb(err, false);
  }
};

const uploadProject = multer({
  storage: projectStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadCert = multer({
  storage: certStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadProject, uploadCert, uploadProfile };
