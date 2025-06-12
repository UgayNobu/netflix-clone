const express = require('express');
const historyController = require('../controllers/historyController');

const router = express.Router();

router
  .route('/')
  .get(historyController.getUserHistory) // Get user's viewing history
  .post(historyController.addToHistory); // Add a movie to history

router
  .route('/:id')
  .delete(historyController.removeFromHistory); // Remove a movie from history

module.exports = router;