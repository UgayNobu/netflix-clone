const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

// Main movie list with search, filter, sort, pagination
router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

// Get trending movies
router.get('/trending', movieController.getTrendingMovies);

// Get Netflix originals
router.get('/netflix-originals', movieController.getNetflixOriginals);

// Get movies by genre (pagination supported)
router.get('/genre/:genreName', movieController.getMoviesByGenre);

// Get movie statistics
router.get('/stats', movieController.getMovieStats);

// Single movie routes (get, update, delete)
router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;