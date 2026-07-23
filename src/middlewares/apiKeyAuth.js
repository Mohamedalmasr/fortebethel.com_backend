const env = require('../config/env');

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No API key provided.',
    });
  }

  if (apiKey !== env.apiKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key.',
    });
  }

  next();
};

module.exports = apiKeyAuth;
