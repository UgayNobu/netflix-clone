const express = require('express');
const path = require('path');
const app = express();

// Serve files from uploads directory (robust for any folder structure)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

module.exports = app;