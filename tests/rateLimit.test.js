const express = require('express');
const rateLimit = require('express-rate-limit');

let testApp;
let testServer;
const PORT = 18234;

beforeAll(() => {
  process.env.RATE_LIMIT_WINDOW_MS = '60000';
  process.env.RATE_LIMIT_MAX = '3';

  const app = express();
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 60000,
    max: 3,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post('/test', limiter, (req, res) => {
    res.status(200).json({ success: true, message: 'OK' });
  });

  testApp = app;
});

afterAll(() => {
  if (testServer) testServer.close();
});

describe('Rate Limiter', () => {
  it('should allow requests within the limit', async () => {
    const request = require('supertest');

    const res1 = await request(testApp).post('/test').expect(200);
    expect(res1.body.success).toBe(true);

    const res2 = await request(testApp).post('/test').expect(200);
    expect(res2.body.success).toBe(true);

    const res3 = await request(testApp).post('/test').expect(200);
    expect(res3.body.success).toBe(true);
  });

  it('should block requests exceeding the limit (429)', async () => {
    const request = require('supertest');

    const res = await request(testApp).post('/test').expect(429);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Too many requests/i);
  });

  it('should include RateLimit headers', async () => {
    const request = require('supertest');

    const res = await request(testApp).post('/test').expect(429);

    expect(res.headers['ratelimit-remaining']).toBeDefined();
    expect(res.headers['ratelimit-limit']).toBeDefined();
  });
});
