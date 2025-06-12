const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await pool.query('SELECT * FROM genres');
    res.status(200).json(genres.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving genres', error: error.message });
  }
};

// Create a new genre
exports.createGenre = async (req, res) => {
  const { name } = req.body;

  try {
    const newGenre = await pool.query(
      'INSERT INTO genres (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(newGenre.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding genre', error: error.message });
  }
};

// Get a genre by ID
exports.getGenre = async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
    if (genre.rows.length === 0) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.status(200).json(genre.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving genre', error: error.message });
  }
};

// Update a genre
exports.updateGenre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedGenre = await pool.query(
      'UPDATE genres SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );

    res.status(200).json(updatedGenre.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating genre', error: error.message });
  }
};

// Delete a genre
exports.deleteGenre = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM genres WHERE id = $1', [id]);
    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting genre', error: error.message });
  }
};