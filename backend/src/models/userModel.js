// src/models/userModel.js

const { prisma } = require('../services/database');

/**
 * Find a user by email
 */
exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Find a user by ID
 */
exports.findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

/**
 * Create a user
 */
exports.createUser = async (data) => {
  return prisma.user.create({ data });
};

/**
 * Update a user by ID
 */
exports.updateUserById = async (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

/**
 * Delete a user by ID
 */
exports.deleteUserById = async (id) => {
  return prisma.user.delete({ where: { id } });
};