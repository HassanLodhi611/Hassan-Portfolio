const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
require('dotenv').config();
console.log("ENV TEST:", process.env.MONGO_URI);
const { cloudinary } = require('./config/cloudinary');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const certificateRoutes = require('./routes/certificates');
const skillRoutes = require('./routes/skills');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');

const app = express();

// ─── Security middleware ──────────────────────────
app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }));
const allowedOrigins = [
  "http://localhost:5173",
  (process.env.CLIENT_URL || "").trim()
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

// ─── Rate limiting ────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Body parsing ─────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);

// ─── Health check ─────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date() });
});

app.get('/api/cloudinary/health', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ success: true, message: 'Cloudinary OK', data: result });
  } catch (err) {
    console.error('Cloudinary health check failed:', err);
    res.status(502).json({ success: false, message: 'Cloudinary health check failed', error: err.message || err.toString() });
  }
});

// ─── 404 handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    message: err.message,
    name: err.name,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
    headers: req.headers && {
      authorization: req.headers.authorization,
      'content-type': req.headers['content-type'],
    },
  });

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File is too large. Maximum allowed is 5MB.'
      : err.message || 'Invalid file upload';
    return res.status(400).json({ success: false, message });
  }

  if (err.name === 'Error' && err.message?.includes('Cloudinary')) {
    return res.status(502).json({ success: false, message: `Cloudinary error: ${err.message}` });
  }

  if (err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('File too large')) {
    return res.status(400).json({ success: false, message: 'File is too large. Maximum allowed is 5MB.' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Database + Start ─────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

startServer();
