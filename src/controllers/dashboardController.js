const Inquiry = require('../models/Inquiry');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Job = require('../models/Job');
const Application = require('../models/Application');
const BlogPost = require('../models/BlogPost');

// @route   GET /api/admin/dashboard (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalInquiries,
      newInquiries,
      inProgressLeads,
      wonLeads,
      lostLeads,
      publishedProjects,
      totalProjects,
      publishedServices,
      totalServices,
      openJobs,
      totalApplications,
      newApplications,
      publishedArticles,
      recentInquiries,
      recentApplications,
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      Inquiry.countDocuments({ status: { $in: ['Contacted', 'Qualified', 'Proposal Sent'] } }),
      Inquiry.countDocuments({ status: 'Won' }),
      Inquiry.countDocuments({ status: 'Lost' }),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments(),
      Service.countDocuments({ status: 'published' }),
      Service.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'New' }),
      BlogPost.countDocuments({ status: 'published' }),
      Inquiry.find().sort({ createdAt: -1 }).limit(6),
      Application.find().populate('jobId', 'title').sort({ createdAt: -1 }).limit(6),
    ]);

    // Calculate lead status breakdown for charts
    const statusAgg = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const leadDistribution = [
      { status: 'New', count: newInquiries },
      { status: 'In Progress', count: inProgressLeads },
      { status: 'Won', count: wonLeads },
      { status: 'Lost', count: lostLeads },
    ];

    // Service category breakdown
    const serviceDistribution = await Service.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalInquiries,
        newInquiries,
        inProgressLeads,
        wonLeads,
        lostLeads,
        publishedProjects,
        totalProjects,
        publishedServices,
        totalServices,
        openJobs,
        totalApplications,
        newApplications,
        publishedArticles,
      },
      leadDistribution,
      serviceDistribution: serviceDistribution.map((s) => ({ category: s._id, count: s.count })),
      recentInquiries,
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};
