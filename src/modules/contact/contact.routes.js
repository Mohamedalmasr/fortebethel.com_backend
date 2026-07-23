const { Router } = require('express');
const contactController = require('./contact.controller');
const validateContact = require('../../middlewares/validateContact');
const rateLimiter = require('../../middlewares/rateLimiter');

const router = Router();

router.post('/', rateLimiter, validateContact, contactController.createContact);
router.get('/:id', contactController.getContact);

module.exports = router;
