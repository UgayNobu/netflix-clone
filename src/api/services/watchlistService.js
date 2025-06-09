import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export const WatchlistService = {
  getWatchlist: () => apiClient.get(API_ENDPOINTS.WATCHLIST.GET),
  addToWatchlist: (movieId) => apiClient.post(API_ENDPOINTS.WATCHLIST.ADD, { movieId }),
  removeFromWatchlist: (movieId) => apiClient.delete(API_ENDPOINTS.WATCHLIST.REMOVE(movieId)),
};