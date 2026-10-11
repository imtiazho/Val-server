const Job = require('../models/Job');
const Application = require('../models/Application');

// @route   GET /api/jobs (Public)
exports.getJobs = async (req, res, next) => {
  try {
    const { department } = req.query;
    let query = { status: 'open' };

    if (department && department !== 'All') {
      query.department = department;
    }

    const jobs = await Job.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/jobs/admin/all (Admin)
exports.getAllJobsAdmin = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    // Attach application counts to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const appCount = await Application.countDocuments({ jobId: job._id });
        const jobObj = job.toObject();
        jobObj.applicationCount = appCount;
        return jobObj;
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      data: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/jobs/:slug (Public)
exports.getJobBySlug = async (req, res, next) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Position not found or closed.' });
    }
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/jobs (Admin)
exports.createJob = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Job.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A job posting with this slug already exists.' });
    }

    const job = await Job.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Job position created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/jobs/:id (Admin)
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job position not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Job position updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/jobs/:id (Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job position not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Job position deleted.',
    });
  } catch (error) {
    next(error);
  }
};
