const mongoose = require('mongoose');

const pricingPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    serviceType: {
      type: String,
      default: 'Full-Stack Web Development',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    currencySymbol: {
      type: String,
      default: '$',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    startingPrice: {
      type: Boolean,
      default: false,
    },
    billingType: {
      type: String,
      enum: ['fixed', 'monthly_retainer', 'custom'],
      default: 'fixed',
    },
    includedScope: {
      type: String,
      default: '',
    },
    pagesCount: {
      type: String,
      default: 'Up to 5 Pages',
    },
    features: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    estimatedTimeline: {
      type: String,
      default: '2-4 Weeks',
    },
    supportPeriod: {
      type: String,
      default: '30 Days SLA Support',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
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

module.exports = mongoose.model('PricingPackage', pricingPackageSchema);
