const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genreRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const historyRoutes = require('./routes/historyRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import custom middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Initialize express app
const app = express();

// Enable CORS
app.use(cors());

// Custom logger (console)
app.use(logger);

// --- IMPORTANT: Register upload route BEFORE body parsers ---
app.use('/api/v1/upload', uploadRoutes);

// Body parsers (safe to use after upload route)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routes
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/genres', genreRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/history', historyRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

// Centralized error handling middleware (must be AFTER all routes)
app.use(errorHandler);

module.exports = app;