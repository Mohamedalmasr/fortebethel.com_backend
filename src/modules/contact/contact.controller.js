const asyncHandler = require('../../utils/asyncHandler');
const { getClientIp } = require('../../utils/clientIp');
const contactService = require('./contact.service');

const create = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  const ip = getClientIp(req);

  const result = await contactService.createRequest({ name, email, phone, message, ip });

  res.status(201).json({
    success: true,
    message: 'Request received successfully',
    data: { id: result.id, receivedAt: result.receivedAt },
  });
});

const getById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  const contact = await contactService.getRequestById(id);
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact request not found',
    });
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});

const remove = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  const contact = await contactService.deleteRequest(id);
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact request not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Contact request deactivated successfully',
    data: { id: contact.id },
  });
});

const getAll = asyncHandler(async (req, res) => {
  const contacts = await contactService.getAllRequests();

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

module.exports = { create, getById, getAll, remove };
