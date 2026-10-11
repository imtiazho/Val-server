const PricingPackage = require('../models/PricingPackage');

// @route   GET /api/pricing (Public)
exports.getPricingPackages = async (req, res, next) => {
  try {
    const packages = await PricingPackage.find({ isActive: true }).sort({ displayOrder: 1, price: 1 });
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/pricing/admin/all (Admin)
exports.getAllPackagesAdmin = async (req, res, next) => {
  try {
    const packages = await PricingPackage.find().sort({ displayOrder: 1 });
    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/pricing (Admin)
exports.createPackage = async (req, res, next) => {
  try {
    const pkg = await PricingPackage.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Pricing package created.',
      data: pkg,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/pricing/:id (Admin)
exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await PricingPackage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Pricing package updated.',
      data: pkg,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/pricing/:id (Admin)
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await PricingPackage.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Pricing package deleted.',
    });
  } catch (error) {
    next(error);
  }
};
