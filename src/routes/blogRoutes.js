const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getAllBlogPostsAdmin,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getBlogPosts);
router.get('/admin/all', protectAdmin, getAllBlogPostsAdmin);
router.get('/:slug', getBlogPostBySlug);
router.post('/', protectAdmin, createBlogPost);
router.put('/:id', protectAdmin, updateBlogPost);
router.delete('/:id', protectAdmin, deleteBlogPost);

module.exports = router;
