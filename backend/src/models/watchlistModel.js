const mongoose = require('mongoose');
const { Schema } = mongoose;

const watchlistSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Watchlist must belong to a user']
  },
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: [true, 'Watchlist must contain a movie']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate entries in watchlist
watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);