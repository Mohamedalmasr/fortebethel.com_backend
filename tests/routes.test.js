const request = require('supertest');
const app = require('../src/app');

describe('Routes & Error Handling', () => {
  it('should return 404 for undefined GET routes', async () => {
    const res = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Route not found/i);
    expect(res.body.message).toContain('GET');
  });

  it('should return 404 for undefined methods on existing routes', async () => {
    const res = await request(app)
      .put('/api/contact-requests')
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Route not found/i);
    expect(res.body.message).toContain('PUT');
  });

  it('should return 404 for PATCH on existing route', async () => {
    const res = await request(app)
      .patch('/api/contact-requests/1')
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('PATCH');
  });

  it('should return 404 for root path', async () => {
    const res = await request(app)
      .get('/')
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});
