import type { StateCreator } from 'zustand';
import type { AppUser } from '../../types/user.types';

// Define the state shape for Auth
export interface AuthSlice {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  // Actions
  setUser: (user: AppUser | null) => void;
  setIsLoadingAuth: (isLoading: boolean) => void;
  logoutState: () => void;
}

// Create the slice
export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  // Start true, auth check happens on mount
  isLoadingAuth: true, 

  setUser: (user) =>
    set(() => ({ 
      user, 
      isAuthenticated: !!user, 
      isLoadingAuth: false 
    })),

  setIsLoadingAuth: (isLoading) => 
    set(() => ({ isLoadingAuth: isLoading })),

  logoutState: () =>
    set(() => ({ 
      user: null, 
      isAuthenticated: false,
      isLoadingAuth: false
    })),
});