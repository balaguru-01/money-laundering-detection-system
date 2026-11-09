const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const dbConfig = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
dbConfig();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});