const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get user's viewing history
exports.getUserHistory = async (req, res) => {
  const { user_id } = req.query;

  try {
    const history = await pool.query(
      'SELECT * FROM history WHERE user_id = $1',
      [user_id]
    );
    res.status(200).json(history.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving history', error: error.message });
  }
};

// Add a movie to history
exports.addToHistory = async (req, res) => {
  const { user_id, movie_id } = req.body;

  try {
    const newEntry = await pool.query(
      'INSERT INTO history (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [user_id, movie_id]
    );

    res.status(201).json(newEntry.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to history', error: error.message });
  }
};

// Remove a movie from history
exports.removeFromHistory = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM history WHERE id = $1', [id]);
    res.status(200).json({ message: 'Movie removed from history successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from history', error: error.message });
  }
};