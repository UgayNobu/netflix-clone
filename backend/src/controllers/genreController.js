/**
 * Genre Controller
 * Handles all genre-related operations including CRUD, search, sorting, and pagination (Prisma version)
 */

const { prisma } = require('../services/database');

/**
 * Get all genres with search, sort, and pagination
 * @route GET /api/v1/genres
 * @query {string} search - Search by genre name
 * @query {string} sort - Sort field (name, createdAt)
 * @query {string} order - Sort order (asc, desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 50)
 */
exports.getAllGenres = async (req, res) => {
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
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [genres, totalCount] = await Promise.all([
      prisma.genre.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limitNum
      }),
      prisma.genre.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: genres.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount
      },
      data: { genres }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Get single genre by ID
 * @route GET /api/v1/genres/:id
 */
exports.getGenre = async (req, res) => {
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: req.params.id }
    });

    if (!genre) {
      return res.status(404).json({
        status: 'fail',
        message: 'Genre not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { genre }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Create new genre
 * @route POST /api/v1/genres
 */
exports.createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Genre name is required'
      });
    }

    const genre = await prisma.genre.create({
      data: { name, description }
    });

    res.status(201).json({
      status: 'success',
      data: { genre }
    });
  } catch (err) {
    // Prisma duplicate key error
    if (err.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'Genre name must be unique'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * Update genre
 * @route PATCH /api/v1/genres/:id
 */
exports.updateGenre = async (req, res) => {
  try {
    const { name, description } = req.body;
    const genre = await prisma.genre.update({
      where: { id: req.params.id },
      data: { name, description }
    });

    res.status(200).json({
      status: 'success',
      data: { genre }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Genre not found'
      });
    }
    if (err.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'Genre name must be unique'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * Delete genre
 * @route DELETE /api/v1/genres/:id
 */
exports.deleteGenre = async (req, res) => {
  try {
    await prisma.genre.delete({
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
        message: 'Genre not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};