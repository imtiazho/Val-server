const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      name: { type: String, default: 'Valence Engineering Team' },
      role: { type: String, default: 'Principal Architect' },
      avatar: { type: String, default: '' },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seo: {
      title: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true }
);

blogPostSchema.index({ slug: 1, status: 1 });
blogPostSchema.index({ category: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
