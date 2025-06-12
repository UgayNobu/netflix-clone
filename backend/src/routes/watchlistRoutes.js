const express = require('express');
const watchlistController = require('../controllers/watchlistController');

const router = express.Router();

router
  .route('/')
  .get(watchlistController.getUserWatchlist) // Get user's watchlist
  .post(watchlistController.addToWatchlist); // Add a movie to watchlist

router
  .route('/:id')
  .delete(watchlistController.removeFromWatchlist); // Remove a movie from watchlist

module.exports = router;