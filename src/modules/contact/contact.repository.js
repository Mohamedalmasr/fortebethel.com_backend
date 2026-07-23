const pool = require('../../config/db');

const TABLE = 'tF_Cntnt';

const create = async ({ formId, ipOrigin, formData }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE "tF_Cntnt" IN EXCLUSIVE MODE');

    const query = `
      WITH next_id AS (
        SELECT COALESCE(MAX("CntntAID"), 0) + 1 AS id
        FROM "tF_Cntnt"
      )
      INSERT INTO "tF_Cntnt" (
        "CntntAID",
        "FormID",
        "RcvdDt",
        "IPOrigin",
        "Form",
        "Status",
        "Owner",
        "Notes",
        "IsActive"
      )
      SELECT
        id,
        $1,
        date_trunc('minute', CURRENT_TIMESTAMP)::timestamp(0),
        $2,
        $3::json,
        'NEW',
        NULL,
        NULL,
        '1'
      FROM next_id
      RETURNING "CntntAID" AS cntnt_aid, "RcvdDt" AS rcvd_dt
    `;
    const values = [formId, ipOrigin, JSON.stringify(formData)];
    const { rows } = await client.query(query, values);

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const findById = async (id) => {
  const query = `
    SELECT
      "CntntAID" AS cntnt_aid,
      "FormID" AS form_id,
      "RcvdDt" AS rcvd_dt,
      "IPOrigin" AS ip_origin,
      "Form" AS form_data,
      "Status" AS status,
      "Owner" AS owner,
      "Notes" AS notes,
      "IsActive" AS is_active
    FROM "tF_Cntnt"
    WHERE "CntntAID" = $1 AND "IsActive" = '1'
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

const findAll = async () => {
  const query = `
    SELECT
      "CntntAID" AS cntnt_aid,
      "FormID" AS form_id,
      "RcvdDt" AS rcvd_dt,
      "IPOrigin" AS ip_origin,
      "Form" AS form_data,
      "Status" AS status,
      "Owner" AS owner,
      "Notes" AS notes,
      "IsActive" AS is_active
    FROM "tF_Cntnt"
    WHERE "FormID" = 10005 AND "IsActive" = '1'
    ORDER BY "CntntAID" DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const remove = async (id) => {
  const query = `
    UPDATE "tF_Cntnt"
    SET "IsActive" = '0'
    WHERE "CntntAID" = $1 AND "IsActive" = '1'
    RETURNING "CntntAID" AS cntnt_aid
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

module.exports = { create, findById, findAll, remove };
