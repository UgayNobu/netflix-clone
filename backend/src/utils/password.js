// Password complexity checker and bcrypt helpers
const bcrypt = require('bcrypt');

// Complexity: min 8 chars, 1 uppercase, 1 lowercase, 1 number
exports.validatePassword = (password) => {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password must be a string' };
  }
  if (password.length < 8)
    return { valid: false, message: 'Password must be at least 8 characters' };
  if (!/[a-z]/.test(password))
    return { valid: false, message: 'Password must have a lowercase letter' };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: 'Password must have an uppercase letter' };
  if (!/[0-9]/.test(password))
    return { valid: false, message: 'Password must have a number' };
  return { valid: true };
};

// Hash password
exports.hashPassword = (password) => bcrypt.hash(password, 12);

// Compare password
exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);