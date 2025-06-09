const dotenv = require('dotenv');

// Load environment variables as early as possible
dotenv.config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
});

// Optional: catch unhandled errors and exit gracefully
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});