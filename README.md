# netflix-clone
Final Group Project for WEB101 &amp; WEB102 – Netflix Clone

## State Management & API Integration

### Store Architecture
- **authStore**: Handles authentication state (user data, tokens)
- **movieStore**: Manages movie data and watchlists
- **uiStore**: Controls modal states and UI preferences

### API Client Features
- Automatic JWT token injection
- Response error handling
- Request/response interceptors

### Custom Hooks
```javascript
// Fetch movies
const { data, isLoading } = useMovies();

// Authentication
const { login, register, logout } = useAuth();

// Watchlist management
const { addToWatchlist, removeFromWatchlist } = useWatchlistActions();
