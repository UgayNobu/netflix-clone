// Centralized error handling middleware

const { sendError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  // If error already handled with sendError, do nothing
  if (res.headersSent) return next(err);

  // Custom errors with status
  if (err.status && err.message) {
    return sendError(res, err.status, err.message, err.extra || {});
  }

  // Joi validation errors (if not already handled)
  if (err.isJoi) {
    return sendError(res, 400, 'Validation failed', {
      details: err.details.map((d) => d.message)
    });
  }

  // Prisma errors (optional, for more control)
  if (err.code && err.code.startsWith('P')) {
    return sendError(res, 400, err.message);
  }

  // Generic fallback
  return sendError(res, 500, 'Internal Server Error');
}

module.exports = errorHandler;