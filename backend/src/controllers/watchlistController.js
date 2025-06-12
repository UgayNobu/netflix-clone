const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get user's watchlist
exports.getUserWatchlist = async (req, res) => {
  const { user_id } = req.query;

  try {
    const watchlist = await pool.query(
      'SELECT * FROM watchlists WHERE user_id = $1',
      [user_id]
    );
    res.status(200).json(watchlist.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving watchlist', error: error.message });
  }
};

// Add a movie to watchlist
exports.addToWatchlist = async (req, res) => {
  const { user_id, movie_id } = req.body;

  try {
    const newEntry = await pool.query(
      'INSERT INTO watchlists (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [user_id, movie_id]
    );

    res.status(201).json(newEntry.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
  }
};

// Remove a movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM watchlists WHERE id = $1', [id]);
    res.status(200).json({ message: 'Movie removed from watchlist successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from watchlist', error: error.message });
  }
};