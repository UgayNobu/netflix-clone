const Watchlist = require('../models/watchlistModel');

exports.getAllWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlist.find();
    
    res.status(200).json({
      status: 'success',
      results: watchlists.length,
      data: {
        watchlists
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getUserWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.params.userId });
    
    res.status(200).json({
      status: 'success',
      results: watchlist.length,
      data: {
        watchlist
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id);
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Watchlist item not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        watchlist
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const newWatchlistItem = await Watchlist.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        watchlist: newWatchlistItem
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Watchlist item not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        watchlist
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findByIdAndDelete(req.params.id);
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Watchlist item not found'
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