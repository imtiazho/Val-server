const express = require('express');
const router = express.Router();
const {
  getJobs,
  getAllJobsAdmin,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/admin/all', protectAdmin, getAllJobsAdmin);
router.get('/:slug', getJobBySlug);
router.post('/', protectAdmin, createJob);
router.put('/:id', protectAdmin, updateJob);
router.delete('/:id', protectAdmin, deleteJob);

module.exports = router;
