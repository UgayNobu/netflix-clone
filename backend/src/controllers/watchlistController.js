/**
 * Watchlist Controller (Prisma version)
 * Handles CRUD operations for user watchlists.
 */

const { prisma } = require('../services/database');

/**
 * Get all watchlist records (for all users, with pagination)
 * @route GET /api/v1/watchlist
 */
exports.getAllWatchlists = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, movieId } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const where = {};
    if (userId) where.userId = userId;
    if (movieId) where.movieId = movieId;

    const [watchlists, totalCount] = await Promise.all([
      prisma.watchlist.findMany({
        where,
        orderBy: { addedAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          user: { select: { id: true, name: true, email: true } },
          movie: { select: { id: true, title: true } }
        }
      }),
      prisma.watchlist.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: watchlists.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      },
      data: { watchlists }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Get a user's watchlist
 * @route GET /api/v1/watchlist/user/:userId
 */
exports.getUserWatchlist = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = { userId: req.params.userId };

    const [watchlist, totalCount] = await Promise.all([
      prisma.watchlist.findMany({
        where,
        orderBy: { addedAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          movie: { select: { id: true, title: true } }
        }
      }),
      prisma.watchlist.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: watchlist.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      },
      data: { watchlist }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Get a single watchlist item by ID
 * @route GET /api/v1/watchlist/:id
 */
exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await prisma.watchlist.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true } },
        movie: { select: { id: true, title: true } }
      }
    });

    if (!watchlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Watchlist item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { watchlist }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Add movie to watchlist
 * @route POST /api/v1/watchlist
 */
exports.addToWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({
        status: 'fail',
        message: 'userId and movieId are required'
      });
    }

    const newWatchlistItem = await prisma.watchlist.create({
      data: {
        userId,
        movieId
      }
    });

    res.status(201).json({
      status: 'success',
      data: { watchlist: newWatchlistItem }
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'This movie is already in the user\'s watchlist'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * Update a watchlist item
 * @route PATCH /api/v1/watchlist/:id
 */
exports.updateWatchlist = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id; // Prevent updating primary key

    const watchlist = await prisma.watchlist.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.status(200).json({
      status: 'success',
      data: { watchlist }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Watchlist item not found'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * Remove movie from watchlist
 * @route DELETE /api/v1/watchlist/:id
 */
exports.removeFromWatchlist = async (req, res) => {
  try {
    await prisma.watchlist.delete({
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
        message: 'Watchlist item not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};