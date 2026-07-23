const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.ADMIN_DB_HOST,
  port: parseInt(process.env.ADMIN_DB_PORT, 10) || 5432,
  user: process.env.ADMIN_DB_USER,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.ADMIN_DB_NAME,
  max: 10,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
  process.exit(1);
});

module.exports = pool;
