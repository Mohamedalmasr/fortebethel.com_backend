const contactRepository = require('./contact.repository');

const createRequest = async ({ name, email, phone, message, ip }) => {
  const formData = { name, email, phone, message };
  const result = await contactRepository.create({
    formId: 10005,
    ipOrigin: ip,
    formData,
  });
  return { id: result.cntnt_aid, receivedAt: result.rcvd_dt };
};

const getRequestById = async (id) => {
  const row = await contactRepository.findById(id);
  if (!row) return null;
  return {
    id: row.cntnt_aid,
    formId: row.form_id,
    receivedAt: row.rcvd_dt,
    ipOrigin: row.ip_origin,
    formData: row.form_data,
    status: row.status,
    owner: row.owner,
    notes: row.notes,
    isActive: row.is_active,
  };
};

const deleteRequest = async (id) => {
  const row = await contactRepository.remove(id);
  if (!row) return null;
  return { id: row.cntnt_aid };
};

const getAllRequests = async () => {
  const rows = await contactRepository.findAll();
  return rows.map((row) => ({
    id: row.cntnt_aid,
    formId: row.form_id,
    receivedAt: row.rcvd_dt,
    ipOrigin: row.ip_origin,
    formData: row.form_data,
    status: row.status,
    owner: row.owner,
    notes: row.notes,
    isActive: row.is_active,
  }));
};

module.exports = { createRequest, getRequestById, deleteRequest, getAllRequests };
