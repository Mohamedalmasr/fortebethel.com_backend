const request = require('supertest');
const app = require('../src/app');
const { API_KEY, invalidApiKey } = require('./helpers');

let createdId;

describe('POST /api/contact-requests', () => {
  const validData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '01012345678',
    message: 'This is a test message for the contact form',
  };

  it('should create a contact request (happy path)', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send(validData)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.receivedAt).toBeDefined();
    createdId = res.body.data.id;
  });

  it('should fail with empty body', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should fail with missing name', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, name: '' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('should fail with short name (1 char)', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, name: 'A' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('should fail with long name (> 100 chars)', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, name: 'A'.repeat(101) })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, email: 'not-an-email' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });

  it('should fail with missing email', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, email: '' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });

  it('should fail with short phone (< 7 chars)', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, phone: '12345' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'phone')).toBe(true);
  });

  it('should fail with phone containing letters', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, phone: 'abcdefgh' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'phone')).toBe(true);
  });

  it('should fail with missing message', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, message: '' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'message')).toBe(true);
  });

  it('should fail with short message (< 5 chars)', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, message: 'Hi' })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'message')).toBe(true);
  });

  it('should fail with long message (> 2000 chars)', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .send({ ...validData, message: 'A'.repeat(2001) })
      .expect(400);

    expect(res.body.errors.some((e) => e.field === 'message')).toBe(true);
  });

  it('should fail with invalid JSON body', async () => {
    const res = await request(app)
      .post('/api/contact-requests')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }')
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid JSON/i);
  });
});

describe('API Key Authentication', () => {
  it('should return 401 when no API key provided', async () => {
    const res = await request(app)
      .get('/api/contact-requests')
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/No API key provided/i);
  });

  it('should return 403 with invalid API key', async () => {
    const res = await request(app)
      .get('/api/contact-requests')
      .set('X-API-Key', invalidApiKey)
      .expect(403);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid API key/i);
  });

  it('should allow access with valid API key', async () => {
    const res = await request(app)
      .get('/api/contact-requests')
      .set('X-API-Key', API_KEY)
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});

describe('GET /api/contact-requests/:id', () => {
  it('should return a contact request by ID', async () => {
    if (!createdId) return;

    const res = await request(app)
      .get(`/api/contact-requests/${createdId}`)
      .set('X-API-Key', API_KEY)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
    expect(res.body.data.formId).toBe(10005);
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app)
      .get('/api/contact-requests/abc')
      .set('X-API-Key', API_KEY)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid ID/i);
  });

  it('should return 404 for non-existent ID', async () => {
    const res = await request(app)
      .get('/api/contact-requests/999999')
      .set('X-API-Key', API_KEY)
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/contact-requests', () => {
  it('should return all contact requests for FormID 10005', async () => {
    const res = await request(app)
      .get('/api/contact-requests')
      .set('X-API-Key', API_KEY)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe('number');

    res.body.data.forEach((item) => {
      expect(item.formId).toBe(10005);
    });
  });
});

describe('DELETE /api/contact-requests/:id', () => {
  it('should return 400 for invalid ID format', async () => {
    const res = await request(app)
      .delete('/api/contact-requests/abc')
      .set('X-API-Key', API_KEY)
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent ID', async () => {
    const res = await request(app)
      .delete('/api/contact-requests/999999')
      .set('X-API-Key', API_KEY)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('should soft-delete (deactivate) a contact request', async () => {
    if (!createdId) return;

    const res = await request(app)
      .delete(`/api/contact-requests/${createdId}`)
      .set('X-API-Key', API_KEY)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deactivated/i);
  });

  it('should return 404 when trying to delete again (already deactivated)', async () => {
    if (!createdId) return;

    const res = await request(app)
      .delete(`/api/contact-requests/${createdId}`)
      .set('X-API-Key', API_KEY)
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('should not return deactivated request via GET', async () => {
    if (!createdId) return;

    const res = await request(app)
      .get(`/api/contact-requests/${createdId}`)
      .set('X-API-Key', API_KEY)
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});
