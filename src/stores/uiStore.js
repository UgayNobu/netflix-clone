import { create } from 'zustand';

export const useUIStore = create((set) => ({
  modals: {
    login: false,
    register: false,
    movieDetails: false,
    profile: false,
  },
  notifications: [],
  isMobileMenuOpen: false,

  openModal: (modalName) => set((state) => ({ 
    modals: { ...state.modals, [modalName]: true } 
  })),

  closeModal: (modalName) => set((state) => ({ 
    modals: { ...state.modals, [modalName]: false } 
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { 
      ...notification, 
      id: Date.now() 
    }]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  toggleMobileMenu: () => set((state) => ({
    isMobileMenuOpen: !state.isMobileMenuOpen
  })),
}));