import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export const AuthService = {
  login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  getCurrentUser: () => apiClient.get(API_ENDPOINTS.AUTH.ME),
  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
};