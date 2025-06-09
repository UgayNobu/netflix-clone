import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WatchlistService } from '../api/services/watchlistService';

export const useWatchlist = () => {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: WatchlistService.getWatchlist,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WatchlistService.addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WatchlistService.removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    },
  });
};

export const useToggleWatchlist = () => {
  const queryClient = useQueryClient();
  const { data: watchlist } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  return (movieId) => {
    const isInWatchlist = watchlist?.some((item) => item.id === movieId);
    
    if (isInWatchlist) {
      return removeFromWatchlist.mutateAsync(movieId);
    } else {
      return addToWatchlist.mutateAsync(movieId);
    }
  };
};