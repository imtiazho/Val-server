const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getTestimonials);
router.get('/admin/all', protectAdmin, getAllTestimonialsAdmin);
router.post('/', protectAdmin, createTestimonial);
router.put('/:id', protectAdmin, updateTestimonial);
router.delete('/:id', protectAdmin, deleteTestimonial);

module.exports = router;
