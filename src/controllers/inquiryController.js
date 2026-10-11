const Inquiry = require('../models/Inquiry');
const validator = require('validator');

// @route   POST /api/inquiries (Public)
exports.createInquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      company,
      service,
      description,
      budget,
      timeline,
      referenceUrl,
      preferredContact,
      privacyConsent,
      scopeEstimateDetails,
    } = req.body;

    // Strict validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!service) {
      return res.status(400).json({ success: false, message: 'Please select a required service.' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a project description (at least 10 characters).' });
    }

    if (!budget) {
      return res.status(400).json({ success: false, message: 'Please select a budget range.' });
    }

    if (!timeline) {
      return res.status(400).json({ success: false, message: 'Please select your desired timeline.' });
    }

    if (!privacyConsent) {
      return res.status(400).json({ success: false, message: 'You must agree to the privacy terms to submit.' });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      company: company ? company.trim() : '',
      service,
      description: description.trim(),
      budget,
      timeline,
      referenceUrl: referenceUrl ? referenceUrl.trim() : '',
      preferredContact: preferredContact || 'Email',
      privacyConsent: Boolean(privacyConsent),
      scopeEstimateDetails: scopeEstimateDetails || null,
      status: 'New',
      source: scopeEstimateDetails ? 'Pricing Scope Estimator' : 'Website Contact Form',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your project inquiry has been received. Our engineering leadership will review your brief and respond within 24 business hours.',
      inquiryId: inquiry._id,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/inquiries (Admin)
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, service, search, sortBy } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (service && service !== 'All') {
      query.service = service;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/inquiries/:id (Admin)
exports.getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry lead not found.' });
    }
    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/inquiries/:id/status (Admin)
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, note, followUpAt } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    if (status) {
      inquiry.status = status;
    }

    if (followUpAt !== undefined) {
      inquiry.followUpAt = followUpAt ? new Date(followUpAt) : null;
    }

    if (note && note.trim()) {
      inquiry.internalNotes.push({
        note: note.trim(),
        author: req.admin ? req.admin.name : 'Admin',
        createdAt: new Date(),
      });
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/inquiries/:id (Admin)
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Inquiry lead deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/inquiries/export/csv (Admin)
exports.exportInquiriesCSV = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    const headers = ['ID', 'Date', 'Name', 'Email', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'Description'];
    const rows = inquiries.map((item) => [
      item._id.toString(),
      item.createdAt.toISOString().split('T')[0],
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.company || '').replace(/"/g, '""')}"`,
      `"${(item.service || '').replace(/"/g, '""')}"`,
      `"${(item.budget || '').replace(/"/g, '""')}"`,
      `"${(item.timeline || '').replace(/"/g, '""')}"`,
      `"${item.status}"`,
      `"${(item.description || '').replace(/\r?\n|\r/g, ' ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=valence-leads-${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
