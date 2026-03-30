const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

// GET /api/projects  (public)
const getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/:id  (public)
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects  (admin)
const createProject = async (req, res) => {
  try {
    const { title, description, category, stack, emoji, github, demo, featured, order } = req.body;

    const projectData = {
      title,
      description,
      category: category || 'web',
      stack: Array.isArray(stack) ? stack : (stack ? stack.split(',').map(s => s.trim()).filter(Boolean) : []),
      emoji: emoji || '🚀',
      github: github || '',
      demo: demo || '',
      featured: featured === 'true' || featured === true,
      order: order ? parseInt(order) : 0,
    };

    if (req.file) {
      const imageUrl = req.file.path || req.file.location || '';
      const publicId = req.file.filename || req.file.public_id || '';

      if (!imageUrl) {
        console.error('Cloudinary response missing URL on upload:', req.file);
        throw new Error('Uploaded image metadata missing uploaded URL (Cloudinary returned bad response)');
      }

      updateData.image = {
        url: imageUrl,
        publicId,
      };
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error('createProject failed:', err);
    // If upload happened but DB failed, clean up Cloudinary
    const failedPublicId = req.file?.filename || req.file?.public_id;
    if (failedPublicId) {
      await cloudinary.uploader.destroy(failedPublicId).catch((cleanupErr) => {
        console.error('Cloudinary cleanup failed after create:', cleanupErr);
      });
    }
    res.status(400).json({ success: false, message: err.message || 'Project creation failed' });
  }
};

// PUT /api/projects/:id  (admin)
// PUT /api/projects/:id  (admin)
const updateProject = async (req, res) => {
  console.log('updateProject called', { id: req.params.id, body: req.body, hasFile: !!req.file });
  if (req.file) {
    console.log('updateProject uploaded file info', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      location: req.file.location,
      filename: req.file.filename,
      public_id: req.file.public_id,
    });
  }
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Project not found' });

    const { title, description, category, stack, emoji, github, demo, featured, order } = req.body;

    const updateData = {
      ...(title        && { title }),
      ...(description  && { description }),
      ...(category     && { category }),
      ...(emoji        && { emoji }),
      ...(github !== undefined && { github }),
      ...(demo   !== undefined && { demo }),
      ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
      ...(order   !== undefined && { order: parseInt(order) }),
      stack: Array.isArray(stack) ? stack : (stack ? stack.split(',').map(s => s.trim()).filter(Boolean) : existing.stack),
    };

    // ✅ FIXED PART STARTS HERE
    if (req.file) {
      // delete old image safely
      if (existing.image && existing.image.publicId) {
        try {
          await cloudinary.uploader.destroy(existing.image.publicId);
        } catch (err) {
          console.log('Cloudinary delete failed:', err.message);
        }
      }

      const imageUrl = req.file.path || req.file.location || '';
      const publicId = req.file.filename || req.file.public_id || '';
      if (imageUrl) {
        updateData.image = {
          url: imageUrl,
          publicId,
        };
      }
    }
    // ✅ FIXED PART ENDS HERE

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: project });
  } catch (err) {
    console.error('updateProject failed:', err);
    res.status(400).json({ success: false, message: err.message || 'Project update failed' });
  }
};

// DELETE /api/projects/:id  (admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.image?.publicId) {
      await cloudinary.uploader.destroy(project.image.publicId).catch(() => {});
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
