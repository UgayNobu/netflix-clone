const express = require('express');
const watchlistController = require('../controllers/watchlistController');

const router = express.Router();

router
  .route('/')
  .get(watchlistController.getAllWatchlists)
  .post(watchlistController.addToWatchlist);

router
  .route('/user/:userId')
  .get(watchlistController.getUserWatchlist);

router
  .route('/:id')
  .get(watchlistController.getWatchlist)
  .patch(watchlistController.updateWatchlist)
  .delete(watchlistController.removeFromWatchlist);

module.exports = router;