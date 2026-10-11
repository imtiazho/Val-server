const express = require('express');
const router = express.Router();
const {
  getProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/admin/all', protectAdmin, getAllProjectsAdmin);
router.get('/:slug', getProjectBySlug);
router.post('/', protectAdmin, createProject);
router.put('/:id', protectAdmin, updateProject);
router.delete('/:id', protectAdmin, deleteProject);

module.exports = router;
