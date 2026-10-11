const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  exportInquiriesCSV,
} = require('../controllers/inquiryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { formLimiter } = require('../middleware/rateLimiter');

router.post('/', formLimiter, createInquiry);
router.get('/', protectAdmin, getInquiries);
router.get('/export/csv', protectAdmin, exportInquiriesCSV);
router.get('/:id', protectAdmin, getInquiryById);
router.put('/:id/status', protectAdmin, updateInquiryStatus);
router.delete('/:id', protectAdmin, deleteInquiry);

module.exports = router;
