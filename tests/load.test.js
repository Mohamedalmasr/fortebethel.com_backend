const request = require('supertest');
const app = require('../src/app');
const { API_KEY } = require('./helpers');

describe('Load Test - GET /api/contact-requests', () => {
  it('should handle 50 concurrent GET requests', async () => {
    const promises = Array.from({ length: 50 }, () =>
      request(app)
        .get('/api/contact-requests')
        .set('X-API-Key', API_KEY)
    );

    const results = await Promise.all(promises);

    const successful = results.filter((r) => r.status === 200);
    const rateLimited = results.filter((r) => r.status === 429);
    const unauthorized = results.filter((r) => r.status === 401 || r.status === 403);

    console.log(`    Results: ${successful.length} successful, ${rateLimited.length} rate-limited, ${unauthorized.length} unauthorized`);

    expect(successful.length).toBeGreaterThan(0);
    results.forEach((res) => {
      expect([200, 401, 403, 429]).toContain(res.status);
    });
  }, 30000);
});

describe('Load Test - POST /api/contact-requests', () => {
  const contactData = {
    name: 'Load Test User',
    email: 'loadtest@example.com',
    phone: '01098765432',
    message: 'This is a load test message for stress testing',
  };

  it('should handle 5 sequential POST requests', async () => {
    const results = [];

    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/api/contact-requests')
        .send(contactData);
      results.push(res.status);
    }

    const successful = results.filter((s) => s === 201);
    const rateLimited = results.filter((s) => s === 429);

    console.log(`    Results: ${successful.length} successful, ${rateLimited.length} rate-limited`);

    expect(successful.length).toBeGreaterThan(0);
    results.forEach((status) => {
      expect([201, 429]).toContain(status);
    });
  }, 30000);

  it('should handle 5 concurrent POST requests', async () => {
    const promises = Array.from({ length: 5 }, () =>
      request(app)
        .post('/api/contact-requests')
        .send(contactData)
    );

    const results = await Promise.all(promises);

    const successful = results.filter((r) => r.status === 201);
    const rateLimited = results.filter((r) => r.status === 429);

    console.log(`    Results: ${successful.length} successful, ${rateLimited.length} rate-limited`);

    expect(successful.length).toBeGreaterThan(0);
  }, 30000);
});

describe('Load Test - Mixed Endpoints', () => {
  it('should handle 10 mixed GET/POST requests concurrently', async () => {
    const promises = [];

    for (let i = 0; i < 5; i++) {
      promises.push(
        request(app)
          .get('/api/contact-requests')
          .set('X-API-Key', API_KEY)
      );
      promises.push(
        request(app)
          .post('/api/contact-requests')
          .send({
            name: 'Concurrent User',
            email: `user${i}@test.com`,
            phone: '01055555555',
            message: `Concurrent test message number ${i}`,
          })
      );
    }

    const results = await Promise.all(promises);

    const getResults = results.filter((r) => r.status === 200);
    const postResults = results.filter((r) => [201, 429].includes(r.status));

    console.log(`    GET: ${getResults.length} successful, POST: ${postResults.length} responded`);

    expect(getResults.length).toBe(5);
    expect(postResults.length).toBe(5);
  }, 30000);
});
