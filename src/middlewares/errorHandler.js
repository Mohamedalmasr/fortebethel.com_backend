const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  logger.error(err.message);
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
