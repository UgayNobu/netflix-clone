/**
 * History Controller (Prisma version)
 * Handles user watch history: CRUD operations, per-user history, clearing history.
 */

const { prisma } = require('../services/database');

/**
 * Get all history records (with pagination and optional filtering)
 * @route GET /api/v1/history
 */
exports.getAllHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, movieId } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const where = {};
    if (userId) where.userId = userId;
    if (movieId) where.movieId = movieId;

    const [history, totalCount] = await Promise.all([
      prisma.history.findMany({
        where,
        orderBy: { watchedAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          user: { select: { id: true, name: true, email: true } },
          movie: { select: { id: true, title: true } }
        }
      }),
      prisma.history.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: history.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      },
      data: { history }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Get history for a specific user (by userId)
 * @route GET /api/v1/history/user/:userId
 */
exports.getUserHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = { userId: req.params.userId };

    const [history, totalCount] = await Promise.all([
      prisma.history.findMany({
        where,
        orderBy: { watchedAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          movie: { select: { id: true, title: true } }
        }
      }),
      prisma.history.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: history.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      },
      data: { history }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Get a single history item by ID
 * @route GET /api/v1/history/:id
 */
exports.getHistoryItem = async (req, res) => {
  try {
    const historyItem = await prisma.history.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true } },
        movie: { select: { id: true, title: true } }
      }
    });

    if (!historyItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'History item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { history: historyItem }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Add new watch history record
 * @route POST /api/v1/history
 */
exports.addToHistory = async (req, res) => {
  try {
    const { userId, movieId, watchedAt, watchDuration = 0, completed = false } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({
        status: 'fail',
        message: 'userId and movieId are required'
      });
    }
    const newHistoryItem = await prisma.history.create({
      data: {
        userId,
        movieId,
        watchedAt: watchedAt ? new Date(watchedAt) : undefined,
        watchDuration: parseInt(watchDuration),
        completed: Boolean(completed)
      }
    });

    res.status(201).json({
      status: 'success',
      data: { history: newHistoryItem }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * Update a history record
 * @route PATCH /api/v1/history/:id
 */
exports.updateHistory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.watchedAt) updateData.watchedAt = new Date(updateData.watchedAt);

    const historyItem = await prisma.history.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.status(200).json({
      status: 'success',
      data: { history: historyItem }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'History item not found'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * Delete a history record
 * @route DELETE /api/v1/history/:id
 */
exports.deleteHistoryItem = async (req, res) => {
  try {
    await prisma.history.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'History item not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Clear all history for a user
 * @route DELETE /api/v1/history/user/:userId
 */
exports.clearUserHistory = async (req, res) => {
  try {
    await prisma.history.deleteMany({
      where: { userId: req.params.userId }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};