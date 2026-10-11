const express = require('express');
const router = express.Router();
const {
  getPricingPackages,
  getAllPackagesAdmin,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/pricingController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getPricingPackages);
router.get('/admin/all', protectAdmin, getAllPackagesAdmin);
router.post('/', protectAdmin, createPackage);
router.put('/:id', protectAdmin, updatePackage);
router.delete('/:id', protectAdmin, deletePackage);

module.exports = router;
