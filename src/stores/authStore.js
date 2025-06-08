import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await AuthService.login(credentials);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        AuthService.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await AuthService.register(userData);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ error, isLoading: false });
          throw error;
        }
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const user = await AuthService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);