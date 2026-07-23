const app = require('./app');
const env = require('./config/env');
const pool = require('./config/db');
const logger = require('./utils/logger');

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    logger.info('HTTP server closed');
    await pool.end();
    logger.info('Database pool closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
