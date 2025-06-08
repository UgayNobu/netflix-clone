import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export const MovieService = {
  getPopular: () => apiClient.get(API_ENDPOINTS.MOVIES.POPULAR),
  getTrending: () => apiClient.get(API_ENDPOINTS.MOVIES.TRENDING),
  getTopRated: () => apiClient.get(API_ENDPOINTS.MOVIES.TOP_RATED),
  getDetails: (id) => apiClient.get(API_ENDPOINTS.MOVIES.DETAILS(id)),
  search: (query) => apiClient.get(API_ENDPOINTS.MOVIES.SEARCH, { params: { query } }),
};