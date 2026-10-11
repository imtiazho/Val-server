const BlogPost = require('../models/BlogPost');

// @route   GET /api/blog (Public)
exports.getBlogPosts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    let query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/blog/admin/all (Admin)
exports.getAllBlogPostsAdmin = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/blog/:slug (Public)
exports.getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Related articles
    const related = await BlogPost.find({
      _id: { $ne: post._id },
      category: post.category,
      status: 'published',
    }).limit(3);

    res.status(200).json({
      success: true,
      data: post,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/blog (Admin)
exports.createBlogPost = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await BlogPost.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An article with this slug already exists.' });
    }

    // calculate approximate read time
    const words = (req.body.content || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    const post = await BlogPost.create({
      ...req.body,
      slug: finalSlug,
      readTimeMinutes: req.body.readTimeMinutes || readTime,
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/blog/:id (Admin)
exports.updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/blog/:id (Admin)
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Article deleted.',
    });
  } catch (error) {
    next(error);
  }
};
