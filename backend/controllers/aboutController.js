const About = require('../models/About');
const { cloudinary } = require('../config/cloudinary');

const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    res.json({ success: true, data: about });
  } catch (err) {
    console.error('getAbout failed:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }

    const {
      name,
      role,
      tagline,
      projects,
      certs,
      p1,
      p2,
      p3,
      highlights,
    } = req.body;

    if (req.file) {
      if (about.image?.publicId) {
        await cloudinary.uploader.destroy(about.image.publicId).catch(() => {});
      }
      const imageUrl = req.file.path || req.file.location || '';
      const publicId = req.file.filename || req.file.public_id || '';
      if (imageUrl) {
        about.image = { url: imageUrl, publicId };
      }
    }

    about.name = name ?? about.name;
    about.role = role ?? about.role;
    about.tagline = tagline ?? about.tagline;
    about.projects = projects ?? about.projects;
    about.certs = certs ?? about.certs;
    about.p1 = p1 ?? about.p1;
    about.p2 = p2 ?? about.p2;
    about.p3 = p3 ?? about.p3;
    about.highlights = highlights ? JSON.parse(highlights) : about.highlights;

    await about.save();
    res.json({ success: true, data: about });
  } catch (err) {
    console.error('updateAbout failed:', err);
    res.status(400).json({ success: false, message: err.message || 'Could not update About' });
  }
};

module.exports = { getAbout, updateAbout };
