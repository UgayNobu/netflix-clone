/**
 * User Controller (Prisma version)
 * Handles CRUD operations for users, with authentication and security enhancements.
 */

const { prisma } = require('../services/database');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const { validatePassword } = require('../utils/password');
const { sendError } = require('../utils/errors');

// Helper to omit password from user object
const omitPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

/**
 * User Registration
 * @route POST /api/v1/users/register
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return sendError(res, 400, 'Email, password, and name are required');
    }

    // Password complexity enforcement
    const complexity = validatePassword(password);
    if (!complexity.valid) {
      return sendError(res, 400, complexity.message);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER'
      }
    });

    // JWT for immediate login
    const token = signToken({ id: user.id, role: user.role });

    res.status(201).json({
      status: 'success',
      token,
      data: { user: omitPassword(user) }
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return sendError(res, 400, 'Email address already exists');
    }
    sendError(res, 400, err.message);
  }
};

/**
 * User Login
 * @route POST /api/v1/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return sendError(res, 403, 'Account is temporarily locked due to failed login attempts');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Increment failed attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: { increment: 1 },
          // Lockout after 5 failed attempts for 10 minutes
          lockedUntil: user.failedLoginAttempts + 1 >= 5
            ? new Date(Date.now() + 10 * 60 * 1000)
            : user.lockedUntil
        }
      });
      return sendError(res, 401, 'Invalid email or password');
    }

    // Reset failed attempts on success
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });

    const token = signToken({ id: user.id, role: user.role });

    res.status(200).json({
      status: 'success',
      token,
      data: { user: omitPassword(user) }
    });
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

/**
 * Get all users (admin only)
 * @route GET /api/v1/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limitNum,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      },
      data: { users }
    });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

/**
 * Get single user by ID (self or admin)
 * @route GET /api/v1/users/:id
 */
exports.getUser = async (req, res) => {
  try {
    // Only allow if requesting own profile or admin
    if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Forbidden');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

/**
 * Update a user by ID (self or admin)
 * @route PATCH /api/v1/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    // Only allow if updating own profile or admin
    if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Forbidden');
    }
    const updateData = { ...req.body };
    delete updateData.id; // Do not allow id update

    // Disallow password change here (use separate endpoint)
    delete updateData.password;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return sendError(res, 404, 'User not found');
    }
    if (err.code === 'P2002') {
      return sendError(res, 400, 'Email address already exists');
    }
    sendError(res, 400, err.message);
  }
};

/**
 * Delete a user by ID (self or admin)
 * @route DELETE /api/v1/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    // Only allow if deleting own profile or admin
    if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Forbidden');
    }
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return sendError(res, 404, 'User not found');
    }
    sendError(res, 500, err.message);
  }
};