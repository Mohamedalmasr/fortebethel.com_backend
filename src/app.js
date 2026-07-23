const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const env = require('./config/env');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const contactRoutes = require('./modules/contact/contact.routes');

const app = express();

app.set('trust proxy', env.trustProxy);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('short'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/contact-requests', contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
