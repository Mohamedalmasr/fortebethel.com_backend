const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .isLength({ min: 7, max: 20 })
    .matches(/^[+\d\s\-()]+$/)
    .withMessage('Phone must be between 7 and 20 characters (numbers only)'),
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be between 5 and 2000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  },
];

module.exports = validateContact;
