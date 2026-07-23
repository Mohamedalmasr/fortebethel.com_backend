const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .escape()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[\d\s\-\+\(\)\.]{7,20}$/).withMessage('Must be a valid phone number'),
  body('message')
    .trim()
    .escape()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 5, max: 2000 }).withMessage('Message must be 5–2000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fieldErrors = errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      });
    }
    next();
  },
];

module.exports = { validateContact };
