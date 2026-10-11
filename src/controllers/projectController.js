const Project = require('../models/Project');

// @route   GET /api/projects (Public)
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;
    let query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { technologyStack: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const projects = await Project.find(query).sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/projects/admin/all (Admin)
exports.getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/projects/:slug (Public)
exports.getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project case study not found.',
      });
    }

    // Related projects in same or similar category
    const related = await Project.find({
      _id: { $ne: project._id },
      status: 'published',
      category: project.category,
    }).limit(3);

    res.status(200).json({
      success: true,
      data: project,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/projects (Admin)
exports.createProject = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Project.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A project with this slug already exists.',
      });
    }

    const project = await Project.create({
      ...req.body,
      slug: finalSlug,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/projects/:id (Admin)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/projects/:id (Admin)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
