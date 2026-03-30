const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { uploadProject } = require('../config/cloudinary');

router.get('/',    getProjects);
router.get('/:id', getProject);

// Admin-protected routes
router.post('/',    protect, uploadProject.single('image'), createProject);
router.put('/:id',  protect, uploadProject.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
