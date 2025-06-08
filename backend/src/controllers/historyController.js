const History = require('../models/historyModel');

exports.getAllHistory = async (req, res) => {
  try {
    const history = await History.find();
    
    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.params.userId }).sort({ watchedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getHistoryItem = async (req, res) => {
  try {
    const historyItem = await History.findById(req.params.id);
    
    if (!historyItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'History item not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        history: historyItem
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const newHistoryItem = await History.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        history: newHistoryItem
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const historyItem = await History.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!historyItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'History item not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        history: historyItem
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteHistoryItem = async (req, res) => {
  try {
    const historyItem = await History.findByIdAndDelete(req.params.id);
    
    if (!historyItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'History item not found'
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

exports.clearUserHistory = async (req, res) => {
  try {
    await History.deleteMany({ user: req.params.userId });
    
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