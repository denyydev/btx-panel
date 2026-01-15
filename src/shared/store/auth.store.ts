import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const JWT_COOKIE_NAME = 'auth_token';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
      };

      Cookies.set(JWT_COOKIE_NAME, mockToken, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove(JWT_COOKIE_NAME);
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const token = Cookies.get(JWT_COOKIE_NAME);
    
    if (token) {
      const mockUser: User = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      };

      set({
        user: mockUser,
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

