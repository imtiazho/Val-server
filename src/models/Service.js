const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
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
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    targetAudience: {
      type: [String],
      default: [],
    },
    businessProblemsSolved: {
      type: [String],
      default: [],
    },
    deliverables: {
      type: [String],
      default: [],
    },
    features: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: 'CheckCircle' },
      },
    ],
    estimatedTimeline: {
      type: String,
      default: '3-6 Weeks',
    },
    pricingModel: {
      type: String,
      default: 'Fixed-Price Milestone / Dedicated Sprint',
    },
    startingPrice: {
      type: String,
      default: 'From $4,500',
    },
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    relatedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
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
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

serviceSchema.index({ slug: 1, status: 1 });
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);
