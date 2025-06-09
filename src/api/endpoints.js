export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
    },
    MOVIES: {
      POPULAR: '/movies/popular',
      TRENDING: '/movies/trending',
      TOP_RATED: '/movies/top-rated',
      DETAILS: (id) => `/movies/${id}`,
      SEARCH: '/movies/search',
    },
    WATCHLIST: {
      GET: '/watchlist',
      ADD: '/watchlist',
      REMOVE: (id) => `/watchlist/${id}`,
    },
  };