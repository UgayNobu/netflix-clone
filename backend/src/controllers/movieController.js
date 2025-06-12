const { Pool } = require('pg'); // Import PostgreSQL Pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await pool.query('SELECT * FROM movies');
    res.status(200).json(movies.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving movies', error: error.message });
  }
};

// Create a new movie
exports.createMovie = async (req, res) => {
  const { title, description, release_date, genre_id } = req.body;

  try {
    const newMovie = await pool.query(
      'INSERT INTO movies (title, description, release_date, genre_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, release_date, genre_id]
    );

    res.status(201).json(newMovie.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding movie', error: error.message });
  }
};

// Get a movie by ID
exports.getMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    if (movie.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving movie', error: error.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, release_date, genre_id } = req.body;

  try {
    const updatedMovie = await pool.query(
      'UPDATE movies SET title = $1, description = $2, release_date = $3, genre_id = $4 WHERE id = $5 RETURNING *',
      [title, description, release_date, genre_id, id]
    );

    res.status(200).json(updatedMovie.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM movies WHERE id = $1', [id]);
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};