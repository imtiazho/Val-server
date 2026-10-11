const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const Job = require('../models/Job');
const validator = require('validator');

// @route   POST /api/applications (Public)
exports.submitApplication = async (req, res, next) => {
  try {
    const {
      jobId,
      applicantName,
      email,
      phone,
      experience,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      coverLetter,
    } = req.body;

    if (!applicantName || applicantName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job identifier is required.' });
    }

    if (!experience || experience.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a summary of your experience.' });
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This position is currently not accepting applications.' });
    }

    let resumeFileName = '';
    let resumePath = '';

    if (req.file) {
      resumeFileName = req.file.originalname;
      resumePath = req.file.filename;
    }

    const application = await Application.create({
      jobId,
      jobTitle: job.title,
      applicantName: applicantName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      experience: experience.trim(),
      portfolioUrl: portfolioUrl ? portfolioUrl.trim() : '',
      githubUrl: githubUrl ? githubUrl.trim() : '',
      linkedinUrl: linkedinUrl ? linkedinUrl.trim() : '',
      coverLetter: coverLetter ? coverLetter.trim() : '',
      resumeFileName,
      resumePath,
      status: 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully. Our engineering recruitment team will review your profile.',
      applicationId: application._id,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications (Admin)
exports.getApplications = async (req, res, next) => {
  try {
    const { jobId, status, search } = req.query;
    let query = {};

    if (jobId && jobId !== 'All') {
      query.jobId = jobId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .populate('jobId', 'title department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/applications/:id/status (Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (status) {
      application.status = status;
    }

    if (note && note.trim()) {
      application.recruiterNotes.push({
        note: note.trim(),
        author: req.admin ? req.admin.name : 'Recruiter',
        createdAt: new Date(),
      });
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/:id/resume (Admin - Secure Download)
exports.getResumeFile = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application || !application.resumePath) {
      return res.status(404).json({ success: false, message: 'Resume file not found.' });
    }

    const filePath = path.join(__dirname, '../../uploads', application.resumePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume file does not exist on disk.' });
    }

    res.download(filePath, application.resumeFileName || 'resume.pdf');
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/applications/:id (Admin)
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.resumePath) {
      const filePath = path.join(__dirname, '../../uploads', application.resumePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Application record removed.',
    });
  } catch (error) {
    next(error);
  }
};
