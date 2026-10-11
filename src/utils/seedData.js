const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const Admin = require('../models/Admin');
const Service = require('../models/Service');
const Project = require('../models/Project');
const PricingPackage = require('../models/PricingPackage');
const Inquiry = require('../models/Inquiry');
const Job = require('../models/Job');
const Application = require('../models/Application');
const BlogPost = require('../models/BlogPost');
const Testimonial = require('../models/Testimonial');
const SiteSettings = require('../models/SiteSettings');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/valence_digital';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await Admin.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await PricingPackage.deleteMany({});
    await Inquiry.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await BlogPost.deleteMany({});
    await Testimonial.deleteMany({});
    await SiteSettings.deleteMany({});

    console.log('[Seed] Inserting initial administrator...');
    const passwordHash = await bcrypt.hash('AdminValence2026!', 12);
    const admin = await Admin.create({
      name: 'Valence Executive',
      email: 'admin@valencedigital.agency',
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });

    console.log('[Seed] Inserting site configuration...');
    await SiteSettings.create({
      agencyName: 'Valence Digital',
      tagline: 'We Build Digital Products That Move Businesses Forward.',
      shortDescription: 'Valence is an elite digital engineering studio partnering with venture-backed startups and international enterprises to build scalable web applications, SaaS platforms, and digital experiences.',
      contactEmail: 'hello@valencedigital.agency',
      supportEmail: 'engineering@valencedigital.agency',
      phone: '+1 (415) 890-4812',
      address: '548 Market St, Suite 79100, San Francisco, CA 94104',
      currency: 'USD',
      currencySymbol: '$',
      socialLinks: {
        github: 'https://github.com/valence-digital',
        linkedin: 'https://linkedin.com/company/valence-digital',
        twitter: 'https://twitter.com/valencedigital',
        dribbble: 'https://dribbble.com/valence-digital',
      },
      announcement: {
        enabled: true,
        badge: 'Q4 / 2026 Availability',
        text: 'Now accepting select new product builds and dedicated engineering sprints.',
        linkText: 'Schedule Architecture Call',
        linkUrl: '/contact',
      },
      defaultSeo: {
        title: 'Valence Digital | Premium Web Engineering & Digital Product Studio',
        description: 'Bespoke web applications, SaaS platforms, and high-performance digital products engineered for scalability.',
      },
    });

    console.log('[Seed] Inserting services...');
    const servicesData = [
      {
        title: 'Custom Web Applications',
        slug: 'custom-web-applications',
        category: 'Custom Web Applications',
        summary: 'Resilient, high-concurrency web systems engineered with modern component architectures and micro-services.',
        description: 'We design and construct mission-critical web applications tailored strictly to your operational requirements. From complex operational workflows to customer-facing portals, our engineering team ensures optimal speed, clean separation of concerns, and rock-solid reliability.',
        targetAudience: ['Venture-backed Startups', 'Mid-market Enterprises', 'Digital Operations Teams'],
        businessProblemsSolved: [
          'Eliminate brittle legacy software and recurring technical debt',
          'Scale concurrent user sessions without server latency spikes',
          'Automate manual spreadsheets and disjointed business processes',
        ],
        deliverables: [
          'Full-stack architecture blueprint & entity schema',
          'High-performance React/Node application codebase',
          'Automated CI/CD pipelines with zero-downtime deployment',
          'Complete API documentation & automated test suites',
        ],
        features: [
          { title: 'Modular Architecture', description: 'Clean decoupled frontend and backend codebases engineered for extensibility.' },
          { title: 'Reactive State', description: 'Instantaneous UI responses with optimistic updates and caching.' },
          { title: 'Security by Design', description: 'End-to-end data encryption, strict CORS, rate-limiting, and RBAC authentication.' },
        ],
        estimatedTimeline: '6 to 12 Weeks',
        pricingModel: 'Fixed-Price Milestone / Dedicated Sprint',
        startingPrice: 'From $12,500',
        process: [
          { step: 1, title: 'Discovery & Schema Mapping', description: 'We map out domain models, permission matrixes, and integration endpoints.' },
          { step: 2, title: 'Interactive Wireframing', description: 'Interactive clickable prototypes verifying workflows before code is written.' },
          { step: 3, title: 'Sprint Engineering', description: 'Bi-weekly builds with automated end-to-end testing and review environments.' },
          { step: 4, title: 'Production Staging & Launch', description: 'Load testing, security auditing, DNS cutover, and continuous monitoring setup.' },
        ],
        faqs: [
          { question: 'Do we own the full intellectual property and source code?', answer: 'Yes. Upon milestone completion, 100% of the repository, assets, and infrastructure configurations belong to you without proprietary lock-in.' },
          { question: 'Can you integrate with our existing enterprise authentication systems?', answer: 'Yes, we regularly integrate Okta, Auth0, Microsoft Azure AD, SAML, and custom OAuth 2.0 providers.' },
        ],
        status: 'published',
        displayOrder: 1,
      },
      {
        title: 'SaaS Platform Development',
        slug: 'saas-development',
        category: 'SaaS Development',
        summary: 'Multi-tenant cloud platforms featuring automated onboarding, billing engines, and role-based permissions.',
        description: 'Launch your SaaS product with an architecture built to scale from day one. We engineer robust multi-tenant architectures, seamless Stripe billing models, granular organization permissions, and high-converting onboarding flows.',
        targetAudience: ['SaaS Founders', 'B2B Tech Ventures', 'Product Incubators'],
        businessProblemsSolved: [
          'Accelerate time-to-market without compromising code quality',
          'Implement intricate subscription, metered, or seat-based billing tiers',
          'Handle data isolation and compliance for demanding enterprise customers',
        ],
        deliverables: [
          'Multi-tenant database tenancy layer with organization scoping',
          'Stripe/LemonSqueezy subscription & invoice management',
          'Admin telemetry portal for user activity and churn monitoring',
          'Self-serve onboarding flows and invite member systems',
        ],
        features: [
          { title: 'Subscription Engine', description: 'Tiered billing, usage-based invoicing, trials, and automated renewal dunning.' },
          { title: 'Granular Permissions', description: 'Role-based access control (RBAC) with team invitations and audit logging.' },
          { title: 'Real-time Telemetry', description: 'In-app event tracking and analytics pipeline integration.' },
        ],
        estimatedTimeline: '8 to 14 Weeks',
        pricingModel: 'Fixed Scope Sprints',
        startingPrice: 'From $18,000',
        process: [
          { step: 1, title: 'SaaS Architecture & Tenancy', description: 'Data isolation modeling, tenant routing, and billing tier definition.' },
          { step: 2, title: 'Core MVP Construction', description: 'Authentication, organizations, subscription webhooks, and primary utility.' },
          { step: 3, title: 'Billing & Edge Hardening', description: 'Stripe integration, proration calculations, email transactional alerts.' },
          { step: 4, title: 'Beta Cohort Launch', description: 'Telemetry verification, feedback cycles, and performance optimization.' },
        ],
        faqs: [
          { question: 'Which payment processors do you support?', answer: 'We natively implement Stripe Billing, Paddle, and LemonSqueezy, complete with localized taxes and invoice PDF generation.' },
        ],
        status: 'published',
        displayOrder: 2,
      },
      {
        title: 'Modern Web Development & Redesign',
        slug: 'web-development',
        category: 'Web Development',
        summary: 'Lighting-fast, conversion-optimized marketing engines that turn inbound traffic into qualified pipeline.',
        description: 'Your marketing website is your agency or brand’s most critical conversion vehicle. We build immaculate, sub-second loading marketing websites combining bespoke typography, interactive demos, and effortless CMS publishing.',
        targetAudience: ['High-growth Startups', 'Modern Consultancies', 'E-commerce Brands'],
        businessProblemsSolved: [
          'Low visitor-to-inquiry conversion rates on outdated static sites',
          'Poor Core Web Vitals resulting in search engine ranking penalties',
          'Marketing teams handcuffed by developer-dependent minor edits',
        ],
        deliverables: [
          'Responsive React website with sub-second page transitions',
          'Custom Headless CMS or admin management system',
          'Lighthouse 95+ performance optimization across desktop and mobile',
          'SEO meta schemas, Open Graph assets, and XML sitemaps',
        ],
        features: [
          { title: 'Sub-second Speeds', description: 'Asset optimization, critical CSS, and intelligent code splitting.' },
          { title: 'Conversion Architecture', description: 'Strategic CTA placements, social proof anchoring, and interactive calculators.' },
          { title: 'Editorial CMS', description: 'Effortless publishing of case studies, blog articles, and service pages.' },
        ],
        estimatedTimeline: '3 to 6 Weeks',
        pricingModel: 'Fixed Package or Milestone',
        startingPrice: 'From $6,500',
        process: [
          { step: 1, title: 'Information Architecture', description: 'Wireframing sitemap, narrative hierarchy, and high-intent conversion hooks.' },
          { step: 2, title: 'High-Fidelity UI Design', description: 'Bespoke layouts with custom typography and interactive components.' },
          { step: 3, title: 'Frontend Development', description: 'Semantic, accessible React coding with responsive fluidity.' },
          { step: 4, title: 'SEO & Performance Audit', description: 'Core Web Vitals validation, analytics tag verification, and deployment.' },
        ],
        faqs: [
          { question: 'How do you guarantee fast load times?', answer: 'We bundle assets with Vite, use modern image formats (WebP/AVIF), defer non-critical scripts, and enforce strict bundle budgets.' },
        ],
        status: 'published',
        displayOrder: 3,
      },
      {
        title: 'UI/UX Design Systems',
        slug: 'ui-ux-design',
        category: 'UI/UX Design',
        summary: 'Editorial, minimalist product interfaces and scalable design systems created in Figma and coded in React.',
        description: 'Great software starts with deliberate design. We craft visually stunning user interfaces and comprehensive design token libraries that provide cohesive user experiences across every viewport.',
        targetAudience: ['Product Managers', 'Technical Founders', 'Engineering Teams'],
        businessProblemsSolved: [
          'Inconsistent UI elements creating visual clutter and user confusion',
          'Slow engineering velocity due to lack of reusable design tokens',
          'High onboarding abandonment due to friction-filled UX',
        ],
        deliverables: [
          'Comprehensive Figma component library & design tokens',
          'Interactive high-fidelity prototypes',
          'Tailwind CSS tokens and component stylesheets',
          'Accessibility (WCAG AA) compliance verification',
        ],
        features: [
          { title: 'Design Token System', description: 'Variables for spacing, typography, color palettes, and surface elevations.' },
          { title: 'Atomic Components', description: 'Tested buttons, inputs, modals, sheets, and interactive data cards.' },
          { title: 'Accessibility First', description: 'High contrast ratios, semantic focus rings, and screen-reader friendliness.' },
        ],
        estimatedTimeline: '4 to 8 Weeks',
        pricingModel: 'Fixed Scope Sprints',
        startingPrice: 'From $8,000',
        process: [
          { step: 1, title: 'User Research & Journey Auditing', description: 'Identify cognitive friction points in key user conversion workflows.' },
          { step: 2, title: 'Visual Identity & Tokens', description: 'Establish typography scales, color hierarchies, and aesthetic direction.' },
          { step: 3, title: 'Component Library Construction', description: 'Create comprehensive design system in Figma with auto-layout.' },
          { step: 4, title: 'Code Token Export', description: 'Translate Figma tokens directly to Tailwind CSS and reusable React modules.' },
        ],
        faqs: [
          { question: 'Do our in-house developers receive design documentation?', answer: 'Yes, we provide full design token specs, component state states (hover, focus, disabled, active), and handoff recordings.' },
        ],
        status: 'published',
        displayOrder: 4,
      },
      {
        title: 'AI Integrations & Workflow Automation',
        slug: 'ai-integrations',
        category: 'AI Integration and Workflow Automation',
        summary: 'Supercharge your web products with semantic vector search, LLM agent assistants, and automated data pipelines.',
        description: 'Harness practical, enterprise-grade artificial intelligence to deliver remarkable user features. We integrate OpenAI, Anthropic Claude, and custom retrieval-augmented generation (RAG) pipelines directly into your web applications.',
        targetAudience: ['SaaS Companies', 'Knowledge Platforms', 'Customer Support Teams'],
        businessProblemsSolved: [
          'Manual customer support overload and slow ticket response times',
          'Inefficient document searching across millions of unstructured records',
          'High labor costs for repetitive content generation and data classification',
        ],
        deliverables: [
          'Vector database integration (Pinecone/pgvector/MongoDB Atlas Vector)',
          'Contextual LLM streaming response endpoints with guardrails',
          'Automated background webhook processors and queue workers',
          'Usage telemetry and token expense tracking dashboard',
        ],
        features: [
          { title: 'RAG Knowledge Pipelines', description: 'Semantic retrieval across your private documentation and databases.' },
          { title: 'Streaming Web Interfaces', description: 'Low-latency token streaming with markdown and code syntax rendering.' },
          { title: 'Cost & Rate Safeguards', description: 'Intelligent prompt caching, token budgeting, and fallbacks.' },
        ],
        estimatedTimeline: '4 to 8 Weeks',
        pricingModel: 'Sprint Retainer / Milestone',
        startingPrice: 'From $9,500',
        process: [
          { step: 1, title: 'Knowledge Architecture', description: 'Chunking strategies, embedding models, and data ingestion pipeline design.' },
          { step: 2, title: 'Prompt & Chain Engineering', description: 'Deterministic tool calls, schema enforcement, and guardrail validation.' },
          { step: 3, title: 'Frontend Integration', description: 'Streaming response widgets, keyboard shortcuts, and chat transcripts.' },
          { step: 4, title: 'Load & Token Optimization', description: 'Latency benchmarking, caching layer setup, and fallback error handling.' },
        ],
        faqs: [
          { question: 'How do you ensure company data privacy with LLMs?', answer: 'We exclusively use enterprise API agreements that guarantee your data is never used to train base foundation models.' },
        ],
        status: 'published',
        displayOrder: 5,
      },
      {
        title: 'Dedicated Maintenance & SLA Support',
        slug: 'website-maintenance',
        category: 'Website Maintenance and Support',
        summary: 'Proactive 24/7 uptime monitoring, dependency patching, security audits, and continuous monthly feature sprints.',
        description: 'Never worry about server outages, broken third-party APIs, or decaying dependencies. Our engineering team acts as your dedicated DevOps and maintenance partner, guaranteeing high availability and rapid emergency response.',
        targetAudience: ['Businesses with Live Web Platforms', 'E-commerce Operators', 'Agencies without DevOps Staff'],
        businessProblemsSolved: [
          'Unexpected website downtime during peak sales or campaign traffic',
          'Accumulated security vulnerabilities in outdated npm packages',
          'Lack of developer bandwidth for urgent bug fixes and incremental features',
        ],
        deliverables: [
          'Guaranteed SLA response times (down to 1 hour for critical incidents)',
          'Bi-weekly dependency security patching and testing',
          'Continuous automated synthetic uptime monitoring and alert paging',
          'Allocated monthly engineering sprint hours for feature rollouts',
        ],
        features: [
          { title: 'Uptime Guarantee', description: 'Global synthetic monitoring checking your API endpoints every 60 seconds.' },
          { title: 'Security Patching', description: 'Continuous automated vulnerability scanning and prompt framework upgrades.' },
          { title: 'Dedicated Slack Channel', description: 'Direct developer-to-developer communication with our senior engineers.' },
        ],
        estimatedTimeline: 'Ongoing Monthly Retainer',
        pricingModel: 'Monthly Retainer SLA',
        startingPrice: 'From $1,800 / Month',
        process: [
          { step: 1, title: 'Repository & Infrastructure Audit', description: 'Review environment configuration, security posture, and bottlenecks.' },
          { step: 2, title: 'Monitoring Setup', description: 'Configure uptime pings, error logging (Sentry), and alert routing.' },
          { step: 3, title: 'Baseline Hardening', description: 'Update vulnerable packages, enforce backup cycles, and document runbooks.' },
          { step: 4, title: 'Monthly Engineering Sprints', description: 'Execute scheduled feature improvements and review performance metrics.' },
        ],
        faqs: [
          { question: 'Can unused maintenance hours roll over to the next month?', answer: 'Yes, up to 50% of your unused monthly maintenance hours roll over into the following billing period.' },
        ],
        status: 'published',
        displayOrder: 6,
      },
    ];

    const insertedServices = await Service.insertMany(servicesData);

    console.log('[Seed] Inserting portfolio case studies...');
    const projectsData = [
      {
        title: 'Strata Cloud Telemetry Platform',
        slug: 'strata-cloud-telemetry',
        category: 'SaaS',
        clientName: 'Strata Observability Inc.',
        industry: 'DevOps & Cloud Infrastructure',
        summary: 'Architecting an enterprise observability dashboard processing 12M+ distributed log events with sub-second chart rendering.',
        problem: 'Strata Cloud was struggling with a legacy React dashboard that suffered severe frame drops when rendering thousands of time-series data points. Customer churn was increasing due to sluggish incident investigation workflows.',
        goals: [
          'Reduce dashboard load time from 4.8s to under 800ms',
          'Support high-frequency live WebSockets streaming without memory leaks',
          'Provide customizable widget layouts with instant query filtering',
        ],
        solution: 'Valence engineered a high-performance web dashboard featuring Canvas-based charting, Web Workers for client-side aggregation, and a decoupled Node.js API with Redis caching. We also rebuilt the design system with high-contrast dark mode typography.',
        process: [
          { phase: 'Discovery', title: 'Telemetry Profiling', description: 'Benchmarked DOM reflow bottlenecks and memory leak patterns under stress testing.' },
          { phase: 'Architecture', title: 'Data Streaming Pipeline', description: 'Designed binary WebSocket protocol and client-side data buffer.' },
          { phase: 'Engineering', title: 'Modular Dashboard Sprints', description: 'Implemented responsive grid layouts and customizable filter queries.' },
          { phase: 'Verification', title: 'Scale & Chaos Testing', description: 'Simulated 50,000 synthetic event bursts across multiple simulated regions.' },
        ],
        technicalImplementation: 'Constructed with React, Tailwind CSS, Node.js, WebSockets, Redis, and TimescaleDB. Implemented virtualized list rendering and WebGL-accelerated chart components to maintain 60 FPS under heavy data volume.',
        keyFeatures: [
          'Sub-second query filtering across multi-gigabyte log datasets',
          'Customizable drag-and-drop dashboard grid with persistent state',
          'Real-time anomaly alerts with webhook and PagerDuty integration',
          'Role-based workspace access for distributed engineering squads',
        ],
        technologyStack: ['React', 'Node.js', 'Redis', 'WebSockets', 'Tailwind CSS', 'Docker'],
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        ],
        liveUrl: 'https://strata-observability-demo.example.com',
        challengesAndDecisions: 'The primary technical bottleneck was memory retention caused by thousands of un-garbage-collected DOM elements. By migrating chart rendering from SVG to Canvas and offloading math to Web Workers, we dropped CPU consumption by 72%.',
        outcomes: [
          { metric: '84%', label: 'Reduction in Dashboard Query Latency' },
          { metric: '3.4x', label: 'Increase in Daily Active Investigation Sessions' },
          { metric: '99.98%', label: 'Platform Availability SLA Maintained' },
        ],
        lessonsLearned: 'Virtualization and binary serialization are critical when handling high-density event streams in modern browser environments.',
        isFeatured: true,
        status: 'published',
        displayOrder: 1,
      },
      {
        title: 'Kinetix Global Logistics Portal',
        slug: 'kinetix-logistics-portal',
        category: 'Web Applications',
        clientName: 'Kinetix Global Freight',
        industry: 'Supply Chain & Freight Tech',
        summary: 'A unified logistics dispatch and freight quotation portal connecting 450+ carriers across North America and Europe.',
        problem: 'Brokers spent up to 45 minutes manually emailing freight quotes, calculating customs surcharges in offline Excel sheets, and cross-referencing carrier capacity across legacy telephone logs.',
        goals: [
          'Automate multi-carrier price comparison and automated customs estimation',
          'Provide real-time GPS container tracking with status milestones',
          'Eliminate manual paper billing with automated Stripe ACH invoicing',
        ],
        solution: 'We constructed an end-to-end logistics platform that computes dynamic quotes in seconds, provides a customer self-serve shipment tracker, and integrates with major carrier telemetry APIs.',
        process: [
          { phase: 'Discovery', title: 'Workflow Mapping', description: 'Shadowed freight dispatchers to uncover undocumented customs exceptions.' },
          { phase: 'Design', title: 'Dense Data Interface', description: 'Created an editorial, compact UI optimized for rapid keyboard data entry.' },
          { phase: 'Engineering', title: 'API Aggregator & Auth', description: 'Built resilient retry queues and carrier rate normalization layers.' },
        ],
        technicalImplementation: 'Built with React, Express, MongoDB, and automated PDF invoice generation. Secure token authentication with permission scopes for carriers, brokers, and enterprise shippers.',
        keyFeatures: [
          'Instantaneous freight quote calculation with fuel surcharge formulas',
          'Interactive route map visualization with milestone progress bars',
          'Digital Bill of Lading (BOL) generation and digital signature capture',
          'Automated invoice generation and payment reconciliation',
        ],
        technologyStack: ['React', 'Express.js', 'MongoDB', 'Mapbox GL', 'Tailwind CSS', 'Node.js'],
        thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80',
        ],
        liveUrl: 'https://kinetix-logistics-demo.example.com',
        challengesAndDecisions: 'Carrier APIs exhibited frequent 504 timeout spikes. We engineered an asynchronous background polling worker with exponential backoff and Redis-backed rate caching.',
        outcomes: [
          { metric: '78%', label: 'Decrease in Time Required to Book Shipments' },
          { metric: '$4.2M', label: 'Quarterly Freight Transacted via Portal' },
          { metric: '0', label: 'Billing Discrepancies Since Automated BOL Launch' },
        ],
        lessonsLearned: 'Building for operational users requires extreme attention to keyboard navigation, tabular density, and instant search.',
        isFeatured: true,
        status: 'published',
        displayOrder: 2,
      },
      {
        title: 'Aura Health Wellness Platform',
        slug: 'aura-health-platform',
        category: 'UI/UX',
        clientName: 'Aura Digital Healthcare',
        industry: 'HealthTech & Telemedicine',
        summary: 'A HIPAA-compliant patient consultation experience and clinical scheduling web application with 4.9/5 satisfaction.',
        problem: 'Patients faced clunky video call setups and confusing medical intake forms, resulting in a 34% drop-off rate before appointments could even take place.',
        goals: [
          'Deliver an accessible, soothing telehealth web interface compliant with WCAG AAA',
          'Streamline clinical intake to under 3 minutes on mobile devices',
          'Direct integration with electronic health record (EHR) scheduling APIs',
        ],
        solution: 'Valence designed an empathic, frictionless UI design system and web application with progressive intake disclosure, automated SMS reminders, and seamless WebRTC consultation rooms.',
        process: [
          { phase: 'Research', title: 'Patient Usability Studies', description: 'Tested multi-generational cohorts on smartphones and tablets.' },
          { phase: 'Design', title: 'Calm & Warm Palette', description: 'Carefully chosen organic hues, legible type sizes, and spacious touch targets.' },
          { phase: 'Development', title: 'WebRTC & Form Engine', description: 'Encrypted consultation flow with fallback audio and auto-reconnect.' },
        ],
        technicalImplementation: 'React frontend, Express.js backend, Twilio WebRTC video service, and encrypted MongoDB patient records. Zero third-party tracker scripts for strict HIPAA compliance.',
        keyFeatures: [
          'One-click video consultations without app installation required',
          'Smart triage intake form with conditional symptom branching',
          'Automated prescription receipt delivery and provider messaging',
        ],
        technologyStack: ['React', 'WebRTC', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Express'],
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        ],
        liveUrl: 'https://aura-health-demo.example.com',
        challengesAndDecisions: 'WebRTC video streams frequently degraded over unstable cellular networks. We implemented adaptive bitrate scaling and automated audio fallback mode.',
        outcomes: [
          { metric: '61%', label: 'Drop in Intake Drop-off Rates' },
          { metric: '4.9/5', label: 'Average Patient Post-Consultation Rating' },
          { metric: '98.5%', label: 'First-Attempt Video Call Success Rate' },
        ],
        lessonsLearned: 'Healthcare design demands extreme clarity and forgiveness: every error state must guide the user with empathy and certainty.',
        isFeatured: true,
        status: 'published',
        displayOrder: 3,
      },
      {
        title: 'Veritas AI Contract Intelligence',
        slug: 'veritas-ai-contracts',
        category: 'AI Integrations',
        clientName: 'Veritas Legal Tech',
        industry: 'LegalTech & Enterprise AI',
        summary: 'AI-assisted contract analysis platform scanning 100+ page NDAs and vendor agreements for risk clauses in under 15 seconds.',
        problem: 'In-house legal teams spent up to 14 hours manually auditing complex enterprise supplier contracts, creating significant deal closing bottlenecks.',
        goals: [
          'Automate risk clause detection with cited legal sources and severity flags',
          'Provide interactive side-by-side clause redlining editor in the browser',
          'Strict enterprise confidentiality with zero training retention',
        ],
        solution: 'Engineered a legal analysis suite utilizing vector search and LLM extraction pipelines. Features synchronized dual-pane PDF viewer and automated redline suggestions.',
        process: [
          { phase: 'Discovery', title: 'Legal Taxonomy', description: 'Collaborated with corporate attorneys to classify 45 distinct risk flags.' },
          { phase: 'Engineering', title: 'Document Parsing & OCR', description: 'Structured text segmentation with coordinate-mapped PDF bounding boxes.' },
          { phase: 'UI Design', title: 'Dual-Pane Redline Editor', description: 'High-precision layout allowing lawyers to accept or edit suggestions with 1 click.' },
        ],
        technicalImplementation: 'React, Node.js, Express, MongoDB Atlas, OpenAI GPT-4o API with structured outputs, PDF.js for coordinate rendering.',
        keyFeatures: [
          'Automated risk score generation with high/medium/low severity badges',
          'Side-by-side synchronized PDF viewer highlighting offending paragraphs',
          'One-click redline export to formatted Word (.docx) documents',
        ],
        technologyStack: ['React', 'Node.js', 'Express', 'OpenAI API', 'Tailwind CSS', 'MongoDB'],
        thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
        ],
        liveUrl: 'https://veritas-ai-demo.example.com',
        challengesAndDecisions: 'Ensuring non-hallucinatory risk ratings required multi-stage verification: first extracting literal text chunks, then evaluating against attorney-approved rulebooks.',
        outcomes: [
          { metric: '88%', label: 'Reduction in Initial Contract Review Time' },
          { metric: '100%', label: 'Compliance with Client Data Retention Mandates' },
          { metric: '42,000+', label: 'Pages Processed Across 12 Pilot Law Firms' },
        ],
        lessonsLearned: 'In domain-specific AI applications, users require exact visual citations back to the source text to build trust.',
        isFeatured: false,
        status: 'published',
        displayOrder: 4,
      },
    ];

    const insertedProjects = await Project.insertMany(projectsData);

    // Link related project to first service
    if (insertedServices[0] && insertedProjects[0]) {
      insertedServices[0].relatedProjects = [insertedProjects[0]._id];
      await insertedServices[0].save();
    }

    console.log('[Seed] Inserting pricing packages...');
    await PricingPackage.insertMany([
      {
        name: 'Starter Launchpad',
        serviceType: 'Marketing & Brand Engine',
        description: 'Ideal for early-stage startups and established businesses requiring a modern, high-converting digital presence built without compromises.',
        currency: 'USD',
        currencySymbol: '$',
        price: 6500,
        startingPrice: true,
        billingType: 'fixed',
        includedScope: 'Complete custom marketing website with headless CMS and SEO foundations.',
        pagesCount: 'Up to 6 Bespoke Pages',
        features: [
          'Bespoke Figma UI/UX Design & Brand Polish',
          'Responsive React / Vite Frontend Engineering',
          'Admin CMS or Contentful/Sanity Integration',
          'Core Web Vitals 95+ Performance Guarantee',
          'Interactive Contact & Lead Capture Forms',
          'Basic Technical SEO & Social Metadata Setup',
          'Staging Review Environment & Deployment',
        ],
        exclusions: [
          'Custom SaaS Multi-tenancy Architecture',
          'Payment Processing & Subscription Billing',
          'Complex Third-party ERP Integrations',
        ],
        estimatedTimeline: '3 to 5 Weeks',
        supportPeriod: '30 Days Post-Launch SLA Support',
        isPopular: false,
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Growth Scale',
        serviceType: 'Custom Web Application / MVP',
        description: 'Engineered for scaling businesses and product teams needing a full-stack web application, client portal, or custom software platform.',
        currency: 'USD',
        currencySymbol: '$',
        price: 14500,
        startingPrice: true,
        billingType: 'fixed',
        includedScope: 'Full-stack custom application with secure authentication, database entities, and payment workflows.',
        pagesCount: 'Up to 15 Screens / Views',
        features: [
          'Everything in Starter Launchpad',
          'End-to-End Database Modeling & RESTful APIs',
          'JWT Authentication, RBAC Roles & Permissions',
          'Stripe Payments / Subscription Billing Integration',
          'Interactive Data Tables with Search & CSV Export',
          'Comprehensive Admin Control Center',
          'Automated CI/CD Pipeline & Zero-Downtime Deploys',
          'Automated Unit & Integration Test Coverage',
        ],
        exclusions: [
          'Mobile Native App Store Packaging (iOS/Android)',
          'Custom Vector AI RAG Infrastructure',
        ],
        estimatedTimeline: '6 to 10 Weeks',
        supportPeriod: '60 Days Dedicated SLA Support',
        isPopular: true,
        isActive: true,
        displayOrder: 2,
      },
      {
        name: 'Enterprise Bespoke',
        serviceType: 'Complex SaaS & Multi-tenant Platforms',
        description: 'Bespoke software architecture for international enterprises, high-volume SaaS platforms, and demanding technology ventures.',
        currency: 'USD',
        currencySymbol: '$',
        price: 28000,
        startingPrice: true,
        billingType: 'custom',
        includedScope: 'Full-cycle enterprise software development with dedicated engineering squads, compliance audits, and SLA guarantees.',
        pagesCount: 'Unlimited Modular Architecture',
        features: [
          'Multi-tenant Database Architecture & Data Isolation',
          'Custom AI Agent / LLM Retrieval Pipelines',
          'High-Concurrency Microservices / WebSocket Streams',
          'SAML / Okta / Azure AD Enterprise SSO',
          'Comprehensive Security Audit & Penetration Hardening',
          'Dedicated Technical Lead & Weekly Steering Sprints',
          'Full Architecture Blueprints & Intellectual Property Handoff',
          '24/7 Production Monitoring & Incident Response',
        ],
        exclusions: [],
        estimatedTimeline: '10 to 16 Weeks',
        supportPeriod: '90 Days SLA + Optional Retainer',
        isPopular: false,
        isActive: true,
        displayOrder: 3,
      },
    ]);

    console.log('[Seed] Inserting career job openings...');
    const jobsData = [
      {
        title: 'Senior Full-Stack Engineer (React & Node)',
        slug: 'senior-full-stack-engineer',
        department: 'Engineering',
        employmentType: 'Full-time',
        location: 'Remote (Worldwide)',
        experienceLevel: 'Senior (5+ Years)',
        salaryRange: '$120,000 - $160,000 USD + Equity',
        summary: 'We are seeking an experienced full-stack engineer who takes immense pride in writing elegant, type-safe, resilient code and building web products that thousands of users rely on daily.',
        responsibilities: [
          'Architect and construct scalable web applications using React, Node.js, Express, and MongoDB/PostgreSQL.',
          'Lead technical discovery sessions with clients to translate business requirements into entity schemas and API contracts.',
          'Champion frontend performance, ensuring sub-second response times and 60 FPS interactions.',
          'Mentor mid-level engineers and conduct thoughtful, rigorous code reviews.',
        ],
        requirements: [
          '5+ years of professional full-stack development experience.',
          'Deep mastery of modern JavaScript/TypeScript, React patterns, and Node.js internals.',
          'Demonstrated track record of shipping production-grade applications from scratch.',
          'Strong empathy for UI/UX details, typography, and responsive micro-interactions.',
          'Excellent written communication skills suited for remote-first collaboration.',
        ],
        benefits: [
          '100% remote work flexibility with flexible working hours',
          'Generous home office stipend & latest Apple hardware provided',
          'Annual learning and conference budget ($2,500/year)',
          'Comprehensive health, dental, and wellness coverage',
          'Unlimited paid time off (minimum 25 days encouraged)',
        ],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'open',
        displayOrder: 1,
      },
      {
        title: 'Lead UI/UX Product Designer',
        slug: 'lead-ui-ux-designer',
        department: 'Design',
        employmentType: 'Full-time',
        location: 'Remote (Americas / EMEA)',
        experienceLevel: 'Lead (6+ Years)',
        salaryRange: '$115,000 - $150,000 USD',
        summary: 'Join Valence as our Lead UI/UX Designer to craft world-class visual systems, editorial web experiences, and complex product interfaces that win accolades and drive conversions.',
        responsibilities: [
          'Own the end-to-end design lifecycle for client web platforms and SaaS applications.',
          'Create comprehensive design systems in Figma with scalable tokens and auto-layout.',
          'Collaborate closely with frontend engineers to ensure pixel-perfect implementation.',
          'Conduct usability testing sessions and distill qualitative insights into intuitive flows.',
        ],
        requirements: [
          '6+ years of digital product and agency design experience.',
          'A standout portfolio demonstrating mastery over typography, layout grids, and interactive prototypes.',
          'Experience building design systems from scratch for large-scale web apps.',
          'Familiarity with frontend frameworks (Tailwind, CSS-in-JS) to facilitate smooth developer handoffs.',
        ],
        benefits: [
          '100% remote work flexibility',
          'High-end design workstation setup',
          'Design conference sponsorship & annual Figma passes',
          'Wellness stipend & health coverage',
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'open',
        displayOrder: 2,
      },
    ];

    const insertedJobs = await Job.insertMany(jobsData);

    console.log('[Seed] Inserting blog articles...');
    await BlogPost.insertMany([
      {
        title: 'Architecting for Sub-Second Web Performance: Real-World Lessons from 50+ Production Builds',
        slug: 'architecting-for-sub-second-performance',
        excerpt: 'How we consistently achieve 95+ Core Web Vitals on high-traffic web applications through disciplined bundle budgets, asset optimization, and intentional rendering strategies.',
        content: `Web performance is not a superficial optimization checkmark applied right before deployment; it is an architectural decision that must be made on day one. In this technical deep dive, we break down the exact strategies our engineering studio uses to guarantee sub-second load times across global client platforms.

### 1. The Myth of the Heavy Framework
Too many modern web applications collapse under the weight of excessive dependencies. A simple date-picker library should not pull in 300 kilobytes of unminified code. At Valence, we maintain strict bundle budgets: our initial JavaScript payload never exceeds 120 KB gzip compressed.

### 2. Eliminating Layout Shifts (CLS)
Cumulative Layout Shift is one of the most frustrating aspects of modern web browsing. We prevent layout shifts by:
- Explicitly specifying aspect ratio boxes for all media and chart containers.
- Loading web fonts with \`font-display: swap\` paired with tuned size-adjust fallback overrides.
- Pre-allocating DOM containers for asynchronously fetched banners and advertisements.

### 3. Server-Side Optimization & Strategic Caching
A fast frontend means nothing if the underlying API takes 800ms to respond. By implementing Redis query caching, database compound indexing, and HTTP Cache-Control headers with stale-while-revalidate semantics, we drive server response latency down to double-digit milliseconds.

### Conclusion
Building fast websites requires discipline and engineering rigor. The reward is tangible: reduced bounce rates, higher search engine visibility, and demonstrably greater conversion metrics.`,
        author: {
          name: 'Marcus Vance',
          role: 'Chief Technology Officer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
        category: 'Architecture & Engineering',
        tags: ['Performance', 'React', 'Core Web Vitals', 'Architecture'],
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        readTimeMinutes: 6,
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Building SaaS Multi-Tenancy: Choosing Between Shared Databases and Isolated Schemas',
        slug: 'building-saas-multi-tenancy-guide',
        excerpt: 'An architectural breakdown of data isolation strategies in modern multi-tenant SaaS platforms, comparing cost, security, compliance, and maintenance overhead.',
        content: `When engineering a B2B SaaS platform, few technical decisions carry as much long-term consequence as your data tenancy architecture. A mistake made here will haunt your engineering team for years as you scale into enterprise contracts.

### The Tenancy Spectrum
There are three fundamental architectural paradigms for multi-tenant data storage:
1. **Shared Database, Shared Schema**: All tenant records coexist in the same collections/tables, demarcated by an immutable \`tenantId\` foreign key.
2. **Shared Database, Isolated Schemas**: A single database instance with dedicated schemas per organization.
3. **Database-Per-Tenant**: Complete physical database isolation for each subscribing customer.

### Why Shared Schema with Row-Level Security Wins for Early-Stage to Growth
For 90% of venture-backed startups, the shared schema model offers unbeatable advantages in infrastructure cost and deployment simplicity. Running automated database migrations across 5,000 individual databases is an operational nightmare. By enforcing strict middleware validation and tenant-scoping query wrappers in your ORM/ODM, you achieve rock-solid isolation without unnecessary infrastructure bloat.

### When Database-Per-Tenant Becomes Non-Negotiable
Enterprise clients in healthcare, banking, or defense often have strict compliance mandates prohibiting co-mingling of data. In those scenarios, we architect a hybrid tenancy engine: standard tiers share infrastructure, while enterprise customers are transparently routed to dedicated cluster nodes.`,
        author: {
          name: 'Elena Rostova',
          role: 'Principal Cloud Architect',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        },
        category: 'SaaS Strategy',
        tags: ['SaaS', 'Database Architecture', 'Multi-Tenancy', 'Security'],
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        readTimeMinutes: 8,
        status: 'published',
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Editorial Minimalism: Why Modern B2B Brands Are Abandoning Generic Startup Aesthetics',
        slug: 'editorial-minimalism-in-web-design',
        excerpt: 'Exploring the shift toward sophisticated typography, deliberate negative space, and authentic technical credibility in contemporary digital agencies.',
        content: `Take a look at the current landscape of tech websites, and you will notice a wearying homogeneity: pastel glassmorphism cards, cartoonish vector illustrations, and meaningless floating 3D spheres. In response, modern high-performing digital agencies are embracing editorial minimalism.

### The Power of High-Contrast Typography
Typography is the voice of your digital product. By relying on well-crafted type hierarchies, disciplined tracking, and purposeful whitespace, a website conveys quiet confidence. It treats the visitor like an intelligent adult rather than a passive consumer looking for flashy amusement.

### Respecting Visual Hierarchy
Every element on your page must justify its existence. If an accent color appears everywhere, it emphasizes nothing. A singular distinctive accent against a canvas of deep charcoal or warm off-white creates immediate visual focus, directing the eye precisely toward high-intent conversion paths.`,
        author: {
          name: 'Julian Sterling',
          role: 'Design Director',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
        category: 'UI/UX & Design Systems',
        tags: ['Design Systems', 'Typography', 'Minimalism', 'UI/UX'],
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        readTimeMinutes: 5,
        status: 'published',
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('[Seed] Inserting genuine client testimonials...');
    await Testimonial.insertMany([
      {
        clientName: 'Alexander Hayes',
        clientRole: 'VP of Product Engineering',
        company: 'Strata Observability',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        quote: 'Valence delivered what two previous dev agencies claimed was technically impossible. Our telemetry dashboard now handles 12M events in real time without dropping a single frame. Their engineering rigor is unmatched.',
        projectRef: 'strata-cloud-telemetry',
        rating: 5,
        isApproved: true,
        displayOrder: 1,
      },
      {
        clientName: 'Sarah Lin',
        clientRole: 'Chief Operating Officer',
        company: 'Kinetix Global Freight',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        quote: 'Working with Valence was seamless. They mapped our complex customs calculations into an intuitive, keyboard-first web interface that saved our dispatchers hundreds of hours in the first quarter alone.',
        projectRef: 'kinetix-logistics-portal',
        rating: 5,
        isApproved: true,
        displayOrder: 2,
      },
      {
        clientName: 'Dr. Michael Bennett',
        clientRole: 'Chief Medical Officer',
        company: 'Aura Health',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        quote: 'Their attention to accessibility and HIPAA compliance gave our clinical board immediate confidence. The patient intake flow is gorgeous and our appointment completion rates hit record highs.',
        projectRef: 'aura-health-platform',
        rating: 5,
        isApproved: true,
        displayOrder: 3,
      },
    ]);

    console.log('[Seed] Inserting initial sample inquiries for CRM demonstration...');
    await Inquiry.insertMany([
      {
        name: 'David Reynolds',
        email: 'david.reynolds@fintechscale.io',
        company: 'FintechScale Technologies',
        service: 'Custom Web Applications',
        description: 'We need to engineer a secure investor portal with multi-factor authentication, automated capital call notices, and real-time portfolio IRR dashboards.',
        budget: '$15,000 - $30,000',
        timeline: '1 to 2 Months',
        referenceUrl: 'https://fintechscale.io',
        preferredContact: 'Email',
        privacyConsent: true,
        status: 'Qualified',
        internalNotes: [
          { note: 'Reviewed investor portal spec. High synergy with our past Strata Observability work.', author: 'Valence Executive', createdAt: new Date() },
        ],
        source: 'Website Contact Form',
      },
      {
        name: 'Clara Oswald',
        email: 'clara@luminahealth.co',
        company: 'Lumina Health Labs',
        service: 'SaaS Platform Development',
        description: 'Looking to build a multi-tenant clinical trials management SaaS with Stripe billing and role-based permissions for researchers and participants.',
        budget: '$30,000+',
        timeline: '2 to 3 Months',
        referenceUrl: '',
        preferredContact: 'Video Call',
        privacyConsent: true,
        status: 'New',
        source: 'Pricing Scope Estimator',
      },
    ]);

    if (insertedJobs[0]) {
      console.log('[Seed] Inserting sample application...');
      await Application.create({
        jobId: insertedJobs[0]._id,
        jobTitle: insertedJobs[0].title,
        applicantName: 'Tariq Anderson',
        email: 'tariq.anderson@example.com',
        phone: '+1 555-019-2834',
        experience: '7 years building React/Node microservices at a venture-backed supply chain startup. Passionate about web performance and design systems.',
        portfolioUrl: 'https://github.com/example-tariq',
        githubUrl: 'https://github.com/example-tariq',
        linkedinUrl: 'https://linkedin.com/in/example-tariq',
        coverLetter: 'I have followed Valence’s engineering publications on sub-second rendering with great interest and would love to contribute to client builds.',
        status: 'Reviewing',
        privacyConsent: true,
      });
    }

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
