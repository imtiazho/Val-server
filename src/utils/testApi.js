const assert = require('assert');

async function testApi() {
  console.log('--- Starting Comprehensive API & Database Verification ---');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  console.log('[Test 1] Checking API Health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthJson = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthJson.status, 'healthy');
  console.log('✓ Health check passed');

  // 2. Settings check
  console.log('[Test 2] Checking Site Settings...');
  const settingsRes = await fetch(`${BASE_URL}/settings`);
  const settingsJson = await settingsRes.json();
  assert.strictEqual(settingsRes.status, 200);
  assert.strictEqual(settingsJson.success, true);
  console.log(`✓ Site settings verified (${settingsJson.data.agencyName})`);

  // 3. Services listing & slug check
  console.log('[Test 3] Checking Public Services...');
  const servicesRes = await fetch(`${BASE_URL}/services`);
  const servicesJson = await servicesRes.json();
  assert.strictEqual(servicesRes.status, 200);
  assert.ok(servicesJson.data.length > 0);
  console.log(`✓ Fetched ${servicesJson.count} public services`);

  const serviceSlug = servicesJson.data[0].slug;
  const singleServiceRes = await fetch(`${BASE_URL}/services/${serviceSlug}`);
  const singleServiceJson = await singleServiceRes.json();
  assert.strictEqual(singleServiceRes.status, 200);
  assert.strictEqual(singleServiceJson.data.slug, serviceSlug);
  console.log(`✓ Service detail by slug verified (${singleServiceJson.data.title})`);

  // 4. Portfolio listing & slug check
  console.log('[Test 4] Checking Portfolio Projects...');
  const projectsRes = await fetch(`${BASE_URL}/projects`);
  const projectsJson = await projectsRes.json();
  assert.strictEqual(projectsRes.status, 200);
  assert.ok(projectsJson.data.length > 0);
  console.log(`✓ Fetched ${projectsJson.count} projects`);

  const projSlug = projectsJson.data[0].slug;
  const singleProjRes = await fetch(`${BASE_URL}/projects/${projSlug}`);
  const singleProjJson = await singleProjRes.json();
  assert.strictEqual(singleProjRes.status, 200);
  assert.strictEqual(singleProjJson.data.slug, projSlug);
  console.log(`✓ Case study by slug verified (${singleProjJson.data.title})`);

  // 5. Pricing packages
  console.log('[Test 5] Checking Pricing Packages...');
  const pricingRes = await fetch(`${BASE_URL}/pricing`);
  const pricingJson = await pricingRes.json();
  assert.strictEqual(pricingRes.status, 200);
  assert.ok(pricingJson.data.length > 0);
  console.log(`✓ Fetched ${pricingJson.count} pricing packages`);

  // 6. Careers & Job positions
  console.log('[Test 6] Checking Career Positions...');
  const jobsRes = await fetch(`${BASE_URL}/jobs`);
  const jobsJson = await jobsRes.json();
  assert.strictEqual(jobsRes.status, 200);
  assert.ok(jobsJson.data.length > 0);
  console.log(`✓ Fetched ${jobsJson.count} open job positions`);

  // 7. Blog articles
  console.log('[Test 7] Checking Blog Articles...');
  const blogRes = await fetch(`${BASE_URL}/blog`);
  const blogJson = await blogRes.json();
  assert.strictEqual(blogRes.status, 200);
  assert.ok(blogJson.data.length > 0);
  console.log(`✓ Fetched ${blogJson.count} articles`);

  // 8. Public Inquiry Submission (Testing MongoDB write & validation)
  console.log('[Test 8] Submitting Test Project Inquiry...');
  const testInquiryPayload = {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne-defense.com',
    company: 'Cyberdyne Systems',
    service: 'SaaS Platform Development',
    description: 'We need to engineer a resilient telemetry platform with zero latency and high availability.',
    budget: '$50,000 - $100,000+',
    timeline: '2 to 4 Months',
    preferredContact: 'Email',
    privacyConsent: true,
  };
  const submitInquiryRes = await fetch(`${BASE_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testInquiryPayload),
  });
  const submitInquiryJson = await submitInquiryRes.json();
  assert.strictEqual(submitInquiryRes.status, 201);
  assert.strictEqual(submitInquiryJson.success, true);
  console.log(`✓ Test inquiry persisted to database! ID: ${submitInquiryJson.inquiryId}`);

  // 9. Admin Authentication
  console.log('[Test 9] Authenticating Administrator...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@valencedigital.agency',
      password: 'AdminValence2026!',
    }),
  });
  const loginJson = await loginRes.json();
  assert.strictEqual(loginRes.status, 200);
  assert.strictEqual(loginJson.success, true);
  const token = loginJson.token;
  console.log(`✓ Admin login successful. Role: ${loginJson.admin.role}`);

  // 10. Protected Dashboard Metrics
  console.log('[Test 10] Checking Protected Admin Dashboard Metrics...');
  const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const dashJson = await dashRes.json();
  assert.strictEqual(dashRes.status, 200);
  assert.strictEqual(dashJson.success, true);
  console.log(`✓ Live dashboard stats fetched! Total Inquiries: ${dashJson.stats.totalInquiries}, Published Services: ${dashJson.stats.publishedServices}`);

  // 11. Protected Inquiries CRM
  console.log('[Test 11] Checking Protected CRM Leads List...');
  const crmRes = await fetch(`${BASE_URL}/inquiries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const crmJson = await crmRes.json();
  assert.strictEqual(crmRes.status, 200);
  const foundSubmitted = crmJson.data.find(d => d.email === 'sarah.connor@cyberdyne-defense.com');
  assert.ok(foundSubmitted, 'Submitted lead should exist in CRM list');
  console.log(`✓ Verified newly submitted lead in admin CRM (${foundSubmitted.name} - ${foundSubmitted.status})`);

  // 12. Updating lead status
  console.log('[Test 12] Updating Lead Status via Admin API...');
  const updateRes = await fetch(`${BASE_URL}/inquiries/${foundSubmitted._id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: 'Qualified',
      note: 'Verified budget and timeline alignment during initial screening.',
    }),
  });
  const updateJson = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateJson.data.status, 'Qualified');
  console.log(`✓ Lead status updated to Qualified with internal note`);

  // 13. Unauthorized API access rejection
  console.log('[Test 13] Verifying 401 Unauthorized Rejection on Protected Endpoint...');
  const unauthRes = await fetch(`${BASE_URL}/admin/dashboard`);
  assert.strictEqual(unauthRes.status, 401);
  console.log('✓ Unauthorized access successfully blocked with 401 status');

  console.log('\n======================================================');
  console.log('ALL 13 API, PERSISTENCE, AUTH & SECURITY CHECKS PASSED!');
  console.log('======================================================\n');
}

testApi().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
