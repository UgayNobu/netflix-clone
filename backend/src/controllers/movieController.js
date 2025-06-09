/**
 * Movie Controller
 * Handles all movie-related operations including CRUD, search, filtering, and pagination
 */

const { prisma } = require('../services/database');
const { deleteFile } = require('../services/cloudinary');

/**
 * Get all movies with cursor-based pagination, filtering, searching, and sorting
 * @route GET /api/v1/movies
 * @query {string} search - Search term for title/description
 * @query {string} genre - Filter by genre name
 * @query {string} year - Filter by release year
 * @query {boolean} trending - Filter trending movies
 * @query {boolean} netflix_original - Filter Netflix originals
 * @query {string} sort - Sort field (title, releaseYear, rating, createdAt)
 * @query {string} order - Sort order (asc, desc)
 * @query {string} cursor - Movie ID to start after (for pagination)
 * @query {number} limit - Items per page (default: 10, max: 50)
 */
exports.getAllMovies = async (req, res) => {
  try {
    const {
      search,
      genre,
      year,
      trending,
      netflix_original,
      sort = 'createdAt',
      order = 'desc',
      cursor,
      limit = 10
    } = req.query;

    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    // Build where clause for filtering
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (year) {
      where.releaseYear = parseInt(year);
    }

    if (trending !== undefined) {
      where.isTrending = trending === 'true' || trending === true;
    }

    if (netflix_original !== undefined) {
      where.isNetflixOriginal = netflix_original === 'true' || netflix_original === true;
    }

    if (genre) {
      where.genres = {
        some: {
          genre: {
            name: { equals: genre, mode: 'insensitive' }
          }
        }
      };
    }

    // Build orderBy clause
    const validSortFields = ['title', 'releaseYear', 'rating', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    // Pagination options
    const findManyOptions = {
      where,
      orderBy: { [sortField]: sortOrder },
      take: limitNum,
      include: {
        genres: {
          include: {
            genre: {
              select: { id: true, name: true }
            }
          }
        }
      }
    };

    if (cursor) {
      findManyOptions.skip = 1;
      findManyOptions.cursor = { id: cursor };
    }

    // Fetch movies
    const movies = await prisma.movie.findMany(findManyOptions);

    // Compute next cursor
    const nextCursor = movies.length === limitNum ? movies[movies.length - 1].id : null;

    // Transform response
    const transformedMovies = movies.map(movie => ({
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    }));

    res.status(200).json({
      status: 'success',
      results: movies.length,
      pagination: {
        limit: limitNum,
        nextCursor,
        hasNextPage: !!nextCursor
      },
      data: {
        movies: transformedMovies
      }
    });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movies',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Get trending movies
 * @route GET /api/v1/movies/trending
 */
exports.getTrendingMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(20, Math.max(1, parseInt(limit)));

    const movies = await prisma.movie.findMany({
      where: { isTrending: true },
      orderBy: { rating: 'desc' },
      take: limitNum,
      include: {
        genres: {
          include: {
            genre: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    const transformedMovies = movies.map(movie => ({
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    }));

    res.status(200).json({
      status: 'success',
      results: movies.length,
      data: {
        movies: transformedMovies
      }
    });
  } catch (err) {
    console.error('Error fetching trending movies:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trending movies'
    });
  }
};

/**
 * Get Netflix original movies
 * @route GET /api/v1/movies/netflix-originals
 */
exports.getNetflixOriginals = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(20, Math.max(1, parseInt(limit)));

    const movies = await prisma.movie.findMany({
      where: { isNetflixOriginal: true },
      orderBy: { createdAt: 'desc' },
      take: limitNum,
      include: {
        genres: {
          include: {
            genre: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    const transformedMovies = movies.map(movie => ({
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    }));

    res.status(200).json({
      status: 'success',
      results: movies.length,
      data: {
        movies: transformedMovies
      }
    });
  } catch (err) {
    console.error('Error fetching Netflix originals:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Netflix originals'
    });
  }
};

/**
 * Get single movie by ID
 * @route GET /api/v1/movies/:id
 */
exports.getMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }

    // Transform the response
    const transformedMovie = {
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    };

    res.status(200).json({
      status: 'success',
      data: {
        movie: transformedMovie
      }
    });
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movie'
    });
  }
};

/**
 * Create new movie
 * @route POST /api/v1/movies
 */
exports.createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      releaseYear,
      duration,
      rating = 0,
      imageUrl,
      videoUrl,
      trailerUrl,
      isTrending = false,
      isNetflixOriginal = false,
      genreIds = []
    } = req.body;

    // Validate required fields
    if (!title || !description || !releaseYear || !duration) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, description, release year, and duration are required'
      });
    }

    // Create movie with genres in a transaction
    const movie = await prisma.$transaction(async (tx) => {
      // Create the movie
      const newMovie = await tx.movie.create({
        data: {
          title,
          description,
          releaseYear: parseInt(releaseYear),
          duration: parseInt(duration),
          rating: parseFloat(rating),
          imageUrl,
          videoUrl,
          trailerUrl,
          isTrending: Boolean(isTrending),
          isNetflixOriginal: Boolean(isNetflixOriginal)
        }
      });

      // Add genre relations if provided
      if (genreIds.length > 0) {
        await tx.movieGenre.createMany({
          data: genreIds.map(genreId => ({
            movieId: newMovie.id,
            genreId
          }))
        });
      }

      // Fetch the complete movie with genres
      return await tx.movie.findUnique({
        where: { id: newMovie.id },
        include: {
          genres: {
            include: {
              genre: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });
    });

    // Transform the response
    const transformedMovie = {
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    };

    res.status(201).json({
      status: 'success',
      data: {
        movie: transformedMovie
      }
    });
  } catch (err) {
    console.error('Error creating movie:', err);
    res.status(400).json({
      status: 'fail',
      message: 'Failed to create movie',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Update movie
 * @route PATCH /api/v1/movies/:id
 */
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove genreIds from updateData as it needs special handling
    const { genreIds, ...movieData } = updateData;

    // Update movie and handle genres in transaction
    const movie = await prisma.$transaction(async (tx) => {
      // Update the movie
      const updatedMovie = await tx.movie.update({
        where: { id },
        data: {
          ...movieData,
          updatedAt: new Date()
        }
      });

      // Handle genre updates if provided
      if (genreIds !== undefined) {
        // Remove existing genre relations
        await tx.movieGenre.deleteMany({
          where: { movieId: id }
        });

        // Add new genre relations
        if (genreIds.length > 0) {
          await tx.movieGenre.createMany({
            data: genreIds.map(genreId => ({
              movieId: id,
              genreId
            }))
          });
        }
      }

      // Fetch the complete updated movie
      return await tx.movie.findUnique({
        where: { id },
        include: {
          genres: {
            include: {
              genre: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });
    });

    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }

    // Transform the response
    const transformedMovie = {
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    };

    res.status(200).json({
      status: 'success',
      data: {
        movie: transformedMovie
      }
    });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(400).json({
      status: 'fail',
      message: 'Failed to update movie',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Delete movie (and its image/video from Cloudinary if needed)
 * @route DELETE /api/v1/movies/:id
 */
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Find movie first (to get image/video URLs for cleanup)
    const movie = await prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }

    // Delete from Cloudinary if URLs contain public IDs
    try {
      if (movie.imageUrl) {
        // await deleteFile(extractPublicId(movie.imageUrl), 'image');
      }
      if (movie.videoUrl) {
        // await deleteFile(extractPublicId(movie.videoUrl), 'video');
      }
      if (movie.trailerUrl) {
        // await deleteFile(extractPublicId(movie.trailerUrl), 'video');
      }
    } catch (cloudinaryErr) {
      console.warn('Warning: Failed to delete media files from Cloudinary:', cloudinaryErr.message);
    }

    // Delete movie from database (Prisma will handle cascade delete for relations)
    await prisma.movie.delete({ where: { id } });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error('Error deleting movie:', err);

    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to delete movie'
    });
  }
};

/**
 * Get movies by genre
 * @route GET /api/v1/movies/genre/:genreName
 */
exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genreName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      genres: {
        some: {
          genre: {
            name: { equals: genreName, mode: 'insensitive' }
          }
        }
      }
    };

    const [movies, totalCount] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          genres: {
            include: {
              genre: {
                select: { id: true, name: true }
              }
            }
          }
        }
      }),
      prisma.movie.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const transformedMovies = movies.map(movie => ({
      ...movie,
      genres: movie.genres.map(mg => mg.genre)
    }));

    res.status(200).json({
      status: 'success',
      results: movies.length,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      data: {
        genre: genreName,
        movies: transformedMovies
      }
    });
  } catch (err) {
    console.error('Error fetching movies by genre:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movies by genre'
    });
  }
};

/**
 * Get movie statistics
 * @route GET /api/v1/movies/stats
 */
exports.getMovieStats = async (req, res) => {
  try {
    const [
      totalMovies,
      trendingCount,
      netflixOriginalsCount,
      avgRating,
      genreStats
    ] = await Promise.all([
      prisma.movie.count(),
      prisma.movie.count({ where: { isTrending: true } }),
      prisma.movie.count({ where: { isNetflixOriginal: true } }),
      prisma.movie.aggregate({
        _avg: { rating: true }
      }),
      prisma.genre.findMany({
        include: {
          _count: {
            select: { movies: true }
          }
        },
        orderBy: {
          movies: {
            _count: 'desc'
          }
        }
      })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalMovies,
          trendingMovies: trendingCount,
          netflixOriginals: netflixOriginalsCount,
          averageRating: parseFloat(avgRating._avg.rating?.toFixed(2) || 0),
          genreDistribution: genreStats.map(genre => ({
            genre: genre.name,
            movieCount: genre._count.movies
          }))
        }
      }
    });
  } catch (err) {
    console.error('Error fetching movie stats:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movie statistics'
    });
  }
};