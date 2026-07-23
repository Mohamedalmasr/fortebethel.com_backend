const contactService = require('./contact.service');
const clientIp = require('../../utils/clientIp');
const asyncHandler = require('../../utils/asyncHandler');

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  const ipAddress = clientIp(req);

  const result = await contactService.createContactRequest({ name, email, phone, message, ipAddress });

  res.status(201).json({
    success: true,
    message: 'Request received successfully',
    data: result,
  });
});

const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await contactService.getContactRequestById(parseInt(id, 10));

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Contact request not found',
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { createContact, getContact };
