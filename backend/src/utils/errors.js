// Standardized error response utility

// Send standardized error
exports.sendError = (res, code = 400, message = 'An error occurred', extra = {}) => {
    return res.status(code).json({
      status: 'error',
      code,
      message,
      ...extra
    });
  };
  
  // Custom error classes (example)
  class AppError extends Error {
    constructor(message, code = 400) {
      super(message);
      this.code = code;
      this.status = 'error';
    }
  }
  
  exports.AppError = AppError;