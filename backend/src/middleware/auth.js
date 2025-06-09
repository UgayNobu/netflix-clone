const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/errors');

// Load secret from env
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Authenticate JWT and attach user info to req.user
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    return sendError(res, 401, 'Authorization header missing or malformed');
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};

// Authorize by role
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user) return sendError(res, 401, 'Not authenticated');
  if (!roles.includes(req.user.role)) {
    return sendError(res, 403, 'Insufficient permissions');
  }
  next();
};