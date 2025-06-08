const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required']
  },
  genres: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Genre'
  }],
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  imageUrl: String,
  videoUrl: String,
  trailerUrl: String,
  isTrending: {
    type: Boolean,
    default: false
  },
  isNetflixOriginal: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);