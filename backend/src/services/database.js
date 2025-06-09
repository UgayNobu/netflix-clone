/**
 * Database service using Prisma Client
 * Provides centralized database operations for the Netflix clone application
 */

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with logging for development
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

/**
 * Connect to the database
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    await prisma.$connect();
    console.log(' Connected to PostgreSQL database');
  } catch (error) {
    console.error(' Database connection failed:', error);
    process.exit(1);
  }
}

/**
 * Disconnect from the database
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log(' Disconnected from database');
  } catch (error) {
    console.error(' Error disconnecting from database:', error);
  }
}

/**
 * Execute database operations within a transaction
 * @param {Function} operations - Function containing database operations
 * @returns {Promise<any>}
 */
async function executeTransaction(operations) {
  return await prisma.$transaction(operations);
}

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
  executeTransaction
};