const pool = require('../../config/db');

const TABLE = 'tF_Cntnt';
const FORM_ID = 10005;

const getNextId = async (client) => {
  const result = await client.query(`SELECT COALESCE(MAX("CntntAID"), 0) + 1 AS next_id FROM "${TABLE}"`);
  return parseInt(result.rows[0].next_id, 10);
};

const create = async ({ name, email, phone, message, ipAddress }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`LOCK TABLE "${TABLE}" IN ACCESS EXCLUSIVE MODE`);

    const nextId = await getNextId(client);
    const receivedAt = new Date();
    const formData = JSON.stringify({ name, email, phone, message });

    await client.query(
      `INSERT INTO "${TABLE}" ("CntntAID", "FormID", "RcvdDt", "IPOrigin", "Form", "Status", "Owner", "Notes", "IsActive")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [nextId, FORM_ID, receivedAt, ipAddress, formData, 'New', null, null, true]
    );

    await client.query('COMMIT');

    return { id: nextId, receivedAt };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM "${TABLE}" WHERE "CntntAID" = $1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { create, findById };
