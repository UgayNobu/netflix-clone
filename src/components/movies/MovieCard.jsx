import { useNavigate } from 'react-router-dom';
import { useToggleWatchlist } from '../../hooks/useWatchlist';
import { Button } from '../ui';

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const toggleWatchlist = useToggleWatchlist();

  return (
    <div className="relative group">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
        onClick={() => navigate(`/movie/${movie.id}`)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold">{movie.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
          >
            {movie.isInWatchlist ? 'Remove' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
};