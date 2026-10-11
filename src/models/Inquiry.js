const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Valid business email is required'],
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    service: {
      type: String,
      required: [true, 'Service required is required'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
    },
    timeline: {
      type: String,
      required: [true, 'Desired timeline is required'],
    },
    referenceUrl: {
      type: String,
      trim: true,
      default: '',
    },
    preferredContact: {
      type: String,
      enum: ['Email', 'Phone', 'WhatsApp', 'Video Call'],
      default: 'Email',
    },
    privacyConsent: {
      type: Boolean,
      required: [true, 'Privacy consent is required'],
      default: false,
    },
    scopeEstimateDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    followUpAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      default: 'Website Contact Page',
    },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
