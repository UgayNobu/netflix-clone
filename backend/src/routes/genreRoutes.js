const express = require('express');
const genreController = require('../controllers/genreController');

const router = express.Router();

router
  .route('/')
  .get(genreController.getAllGenres) // Get all genres
  .post(genreController.createGenre); // Add a new genre

router
  .route('/:id')
  .get(genreController.getGenre) // Get a genre by ID
  .patch(genreController.updateGenre) // Update a genre by ID
  .delete(genreController.deleteGenre); // Delete a genre by ID

module.exports = router;