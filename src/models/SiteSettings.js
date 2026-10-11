const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      default: 'Valence Digital',
    },
    tagline: {
      type: String,
      default: 'We Build Digital Products That Move Businesses Forward.',
    },
    shortDescription: {
      type: String,
      default: 'An international digital engineering studio partnering with ambitious tech ventures, SaaS platforms, and modern enterprises to architect exceptional web products.',
    },
    contactEmail: {
      type: String,
      default: 'hello@valencedigital.agency',
    },
    supportEmail: {
      type: String,
      default: 'eng@valencedigital.agency',
    },
    phone: {
      type: String,
      default: '+1 (415) 890-4812',
    },
    address: {
      type: String,
      default: '548 Market St, Suite 79100, San Francisco, CA 94104',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    currencySymbol: {
      type: String,
      default: '$',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://x.com' },
      dribbble: { type: String, default: 'https://dribbble.com' },
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      badge: { type: String, default: 'Q4 Availability' },
      text: { type: String, default: 'Accepting select new web platform & SaaS build sprints for next month.' },
      linkText: { type: String, default: 'Reserve a Sprint' },
      linkUrl: { type: String, default: '/contact' },
    },
    defaultSeo: {
      title: { type: String, default: 'Valence Digital | Premium Web Engineering & Digital Product Studio' },
      description: { type: String, default: 'Bespoke web applications, SaaS platforms, and high-performance digital products engineered for scalability.' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
