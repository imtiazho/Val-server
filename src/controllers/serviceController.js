const Service = require('../models/Service');

// @route   GET /api/services (Public)
exports.getServices = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/services/admin/all (Admin)
exports.getAllServicesAdmin = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/services/:slug (Public)
exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
      .populate('relatedProjects', 'title slug category thumbnail summary');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/services (Admin)
exports.createService = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Service.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A service with this slug already exists.',
      });
    }

    const service = await Service.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/services/:id (Admin)
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/services/:id (Admin)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
