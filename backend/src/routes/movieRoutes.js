const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router
  .route('/')
  .get(movieController.getAllMovies) // Get all movies
  .post(movieController.createMovie); // Add a new movie

router
  .route('/:id')
  .get(movieController.getMovie) // Get a movie by ID
  .patch(movieController.updateMovie) // Update a movie by ID
  .delete(movieController.deleteMovie); // Delete a movie by ID

module.exports = router;