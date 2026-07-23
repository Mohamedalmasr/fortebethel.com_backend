require('./config/env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const contactRoutes = require('./modules/contact/contact.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK' });
});

app.use('/api/contact-requests', contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
