import { useQuery } from '@tanstack/react-query';
import { useMovieStore } from '../stores/movieStore';
import { MovieService } from '../api/services/movieService';

export const usePopularMovies = () => {
  const { setPopularMovies } = useMovieStore();

  return useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: MovieService.getPopular,
    onSuccess: (data) => {
      setPopularMovies(data);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useTrendingMovies = () => {
  const { setTrendingMovies } = useMovieStore();

  return useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: MovieService.getTrending,
    onSuccess: (data) => {
      setTrendingMovies(data);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useTopRatedMovies = () => {
  const { setTopRatedMovies } = useMovieStore();

  return useQuery({
    queryKey: ['movies', 'top-rated'],
    queryFn: MovieService.getTopRated,
    onSuccess: (data) => {
      setTopRatedMovies(data);
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useMovieDetails = (movieId) => {
  const { setCurrentMovie } = useMovieStore();

  return useQuery({
    queryKey: ['movies', movieId],
    queryFn: () => MovieService.getDetails(movieId),
    onSuccess: (data) => {
      setCurrentMovie(data);
    },
    enabled: !!movieId,
  });
};

export const useSearchMovies = (query) => {
  const { setSearchResults } = useMovieStore();

  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => MovieService.search(query),
    onSuccess: (data) => {
      setSearchResults(data);
    },
    enabled: !!query,
  });
};