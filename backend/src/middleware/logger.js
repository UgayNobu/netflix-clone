// Simple request logger middleware

function logger(req, res, next) {
    // You can enrich this with IP, user ID, etc.
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  }
  
  module.exports = logger;