const { Router } = require('express');
const { validateContact } = require('../../middlewares/validateContact');
const { contactRateLimiter } = require('../../middlewares/rateLimiter');
const apiKeyAuth = require('../../middlewares/apiKeyAuth');
const controller = require('./contact.controller');

const router = Router();

router.post('/', contactRateLimiter, validateContact, controller.create);
router.get('/', apiKeyAuth, controller.getAll);
router.get('/:id', apiKeyAuth, controller.getById);
router.delete('/:id', apiKeyAuth, contactRateLimiter, controller.remove);

module.exports = router;
