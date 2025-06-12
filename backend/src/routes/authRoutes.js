const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg'); // Import PostgreSQL Pool

const router = express.Router();

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Signup Endpoint
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
  
    try {
      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, role',
        [email, hashedPassword, name]
      );
  
      // Generate JWT token
      const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Respond with token and user details
      res.status(201).json({
        token,
        user: newUser.rows[0],
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  });

// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Find user by email
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Respond with token and user details
      res.status(200).json({
        token,
        user: {
          id: user.rows[0].id,
          email: user.rows[0].email,
          name: user.rows[0].name,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  });

module.exports = router;