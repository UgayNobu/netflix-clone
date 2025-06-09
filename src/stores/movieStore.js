import { create } from 'zustand';

export const useMovieStore = create((set) => ({
  popularMovies: [],
  trendingMovies: [],
  topRatedMovies: [],
  currentMovie: null,
  searchResults: [],
  isLoading: false,
  error: null,

  setPopularMovies: (movies) => set({ popularMovies: movies }),
  setTrendingMovies: (movies) => set({ trendingMovies: movies }),
  setTopRatedMovies: (movies) => set({ topRatedMovies: movies }),
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
  setSearchResults: (results) => set({ searchResults: results }),
}));