
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

# Netflix Clone Frontend

A fully responsive and visually appealing Netflix Clone built as the final group project for WEB101 & WEB102. This project replicates the core features of Netflix's user interface, providing a seamless and interactive user experience.

## Features

- **Responsive Design**: Optimized for all screen sizes, including mobile, tablet, and desktop.
- **Dynamic Movie Listings**: Display movies dynamically with posters, titles, and descriptions.
- **Interactive UI**: Clickable movie cards to view details or play trailers.
- **Video Playback**: Integrated video player for streaming content.
- **Modern Styling**: Styled using CSS and modern design principles to mimic Netflix's UI.

## Tech Stack

- **React**: For building the user interface.
- **Next.js**: For server-side rendering and routing.
- **CSS/SCSS**: For styling the application.
- **JavaScript (ES6+)**: For interactivity and logic.

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/netflix-clone.git

2. Navigate to the project directory:
cd netflix-clone

3. Install dependencies:
npm install

4. Start the development server:
npm run dev

5. Open your browser and navigate to
 http://localhost:3000.

## Folder Structure
src/
├── app/
│   ├── components/    # Reusable components (e.g., Navbar, MovieCard)
│   ├── pages/         # Application pages (e.g., Home, Movie Details)
│   ├── styles/        # Global and component-specific styles
│   └── utils/         # Utility functions and helpers
├── public/            # Static assets (e.g., images, videos)
└── README.md          # Project documentation


## Future Enhancements
Authentication: Add user login and signup functionality.
Search & Filter: Implement search and filter options for movies.
Backend Integration: Connect to a backend API for dynamic data fetching.
User Profiles: Allow users to create and manage profiles.
Contributors
Ugyen Norbu – Frontend Developer
Yeshey Lhaden – UI/UX Designer
Phuntsho Namgyel – Backend Developer

License
This project is licensed under the MIT License.

Thank you for checking out our Netflix Clone! Feel free to contribute or provide feedback.

```


