const Genre = require('../models/genreModel');

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    
    res.status(200).json({
      status: 'success',
      results: genres.length,
      data: {
        genres
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getGenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    
    if (!genre) {
      return res.status(404).json({
        status: 'fail',
        message: 'Genre not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        genre
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const newGenre = await Genre.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        genre: newGenre
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!genre) {
      return res.status(404).json({
        status: 'fail',
        message: 'Genre not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        genre
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    
    if (!genre) {
      return res.status(404).json({
        status: 'fail',
        message: 'Genre not found'
      });
    }
    
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