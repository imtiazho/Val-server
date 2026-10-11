const Testimonial = require('../models/Testimonial');

// @route   GET /api/testimonials (Public)
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/testimonials/admin/all (Admin)
exports.getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/testimonials (Admin)
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Testimonial added.',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/testimonials/:id (Admin)
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Testimonial updated.',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/testimonials/:id (Admin)
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Testimonial removed.',
    });
  } catch (error) {
    next(error);
  }
};
