const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Error handling middleware
app.use(errorHandler);

module.exports = app;