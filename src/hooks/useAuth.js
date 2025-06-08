import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { AuthService } from '../api/services/authService';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      login(data);
      queryClient.invalidateQueries(['user']);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const register = useAuthStore((state) => state.register);

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      register(data);
      queryClient.invalidateQueries(['user']);
    },
  });
};

export const useCurrentUser = () => {
  const { user, isAuthenticated, fetchCurrentUser } = useAuthStore();
  
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
    initialData: user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};