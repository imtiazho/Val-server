const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    location: {
      type: String,
      default: 'Remote (Worldwide)',
    },
    experienceLevel: {
      type: String,
      default: 'Senior',
    },
    salaryRange: {
      type: String,
      default: 'Competitive Market Rate',
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

jobSchema.index({ slug: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
