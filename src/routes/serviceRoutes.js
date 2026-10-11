const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServicesAdmin,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getServices);
router.get('/admin/all', protectAdmin, getAllServicesAdmin);
router.get('/:slug', getServiceBySlug);
router.post('/', protectAdmin, createService);
router.put('/:id', protectAdmin, updateService);
router.delete('/:id', protectAdmin, deleteService);

module.exports = router;
