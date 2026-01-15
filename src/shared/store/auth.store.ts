import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { User } from '../api/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const JWT_COOKIE_NAME = 'auth_token';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  setToken: (token: string | null) => {
    if (token) {
      Cookies.set(JWT_COOKIE_NAME, token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    } else {
      Cookies.remove(JWT_COOKIE_NAME);
    }
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user && !!get().token });
  },

  logout: () => {
    Cookies.remove(JWT_COOKIE_NAME);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

