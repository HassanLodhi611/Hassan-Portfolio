const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Hassan Lodhi' },
    role: { type: String, default: 'Web Developer & Cybersecurity Enthusiast' },
    tagline: { type: String, default: 'Web Developer | Cybersecurity Learner' },
    projects: { type: String, default: '15+' },
    certs: { type: String, default: '5+' },
    p1: { type: String, default: '' },
    p2: { type: String, default: '' },
    p3: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', AboutSchema);
