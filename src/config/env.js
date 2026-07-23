const path = require('path');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', '..', envFile) });

const parseTrustProxy = (value) => {
  if (value === undefined) return false;
  if (value === 'true') return true;
  if (value === 'false') return false;

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? value : parsed;
};

const env = {
  port: parseInt(process.env.PORT, 10) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  adminDb: {
    host: process.env.ADMIN_DB_HOST,
    port: parseInt(process.env.ADMIN_DB_PORT, 10) || 5432,
    user: process.env.ADMIN_DB_USER,
    password: process.env.ADMIN_DB_PASSWORD,
    database: process.env.ADMIN_DB_NAME,
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 600000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5,
  apiKey: process.env.API_KEY || '',
};

module.exports = env;
