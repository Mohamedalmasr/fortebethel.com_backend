const { Pool } = require('pg');
const env = require('./env');

const hasAdminDbConfig = Boolean(
  env.adminDb.host || env.adminDb.user || env.adminDb.password || env.adminDb.database,
);

const connectionConfig = env.databaseUrl
  ? { connectionString: env.databaseUrl }
  : hasAdminDbConfig
    ? env.adminDb
    : {};

const pool = new Pool({
  ...connectionConfig,
  max: env.nodeEnv === 'production' ? 20 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: env.nodeEnv === 'production'
    ? { rejectUnauthorized: false, sslmode: 'require' }
    : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error:', err);
});

module.exports = pool;
