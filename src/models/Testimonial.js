const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientRole: {
      type: String,
      required: [true, 'Role / Title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    quote: {
      type: String,
      required: [true, 'Testimonial quote is required'],
    },
    projectRef: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
