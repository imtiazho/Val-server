const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  getResumeFile,
  deleteApplication,
} = require('../controllers/applicationController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { formLimiter } = require('../middleware/rateLimiter');

router.post('/', formLimiter, upload.single('resume'), submitApplication);
router.get('/', protectAdmin, getApplications);
router.get('/:id/resume', protectAdmin, getResumeFile);
router.put('/:id/status', protectAdmin, updateApplicationStatus);
router.delete('/:id', protectAdmin, deleteApplication);

module.exports = router;
