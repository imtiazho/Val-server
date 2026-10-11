const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    clientName: {
      type: String,
      default: 'Confidential Client',
    },
    industry: {
      type: String,
      default: 'Technology & SaaS',
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    problem: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    goals: {
      type: [String],
      default: [],
    },
    solution: {
      type: String,
      required: [true, 'Proposed solution is required'],
    },
    process: [
      {
        phase: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    technicalImplementation: {
      type: String,
      required: [true, 'Technical implementation is required'],
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    technologyStack: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
    },
    challengesAndDecisions: {
      type: String,
      default: '',
    },
    outcomes: [
      {
        metric: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    lessonsLearned: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    seo: {
      title: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true }
);

projectSchema.index({ slug: 1, status: 1 });
projectSchema.index({ category: 1, isFeatured: 1 });

module.exports = mongoose.model('Project', projectSchema);
