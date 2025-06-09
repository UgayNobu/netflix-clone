const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Sign JWT
exports.signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// Verify JWT
exports.verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET);