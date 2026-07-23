const contactRepository = require('./contact.repository');
const logger = require('../../utils/logger');

const createContactRequest = async (data) => {
  const result = await contactRepository.create(data);
  logger.info(`Contact request created with ID: ${result.id}`);
  return {
    id: result.id,
    receivedAt: result.receivedAt,
  };
};

const getContactRequestById = async (id) => {
  const row = await contactRepository.findById(id);
  if (!row) return null;

  const form = typeof row.Form === 'string' ? JSON.parse(row.Form) : row.Form;

  return {
    id: row.CntntAID,
    formId: row.FormID,
    name: form.name,
    email: form.email,
    phone: form.phone,
    message: form.message,
    receivedAt: row.RcvdDt,
    ipAddress: row.IPOrigin,
    status: row.Status,
    owner: row.Owner,
    notes: row.Notes,
    isActive: row.IsActive,
  };
};

module.exports = { createContactRequest, getContactRequestById };
