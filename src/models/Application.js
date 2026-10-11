const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    jobTitle: {
      type: String,
      default: '',
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      required: [true, 'Relevant experience summary is required'],
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    coverLetter: {
      type: String,
      default: '',
    },
    resumeFileName: {
      type: String,
      default: '',
    },
    resumePath: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Interviewing', 'Offered', 'Rejected'],
      default: 'New',
    },
    recruiterNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: 'Recruiter' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    privacyConsent: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
