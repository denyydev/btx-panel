import Cookies from "js-cookie";
import { create } from "zustand";
import type { User } from "../api/auth.service";
import { authApi } from "../api/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isHydrating: boolean;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;

  initFromCookie: () => void;
  fetchMe: () => Promise<void>;

  logout: () => void;
}

const JWT_COOKIE_NAME = "auth_token";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isHydrating: true,

  setToken: (token: string | null) => {
    if (token) {
      Cookies.set(JWT_COOKIE_NAME, token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } else {
      Cookies.remove(JWT_COOKIE_NAME);
    }
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user && !!get().token });
  },

  initFromCookie: () => {
    const token = Cookies.get(JWT_COOKIE_NAME) || null;
    set({ token, isAuthenticated: !!token });
  },

  fetchMe: async () => {
    const token = get().token;
    if (!token) {
      set({ user: null, isAuthenticated: false, isHydrating: false });
      return;
    }

    try {
      const me = await authApi.me(token);
      set({ user: me, isAuthenticated: true, isHydrating: false });
    } catch {
      Cookies.remove(JWT_COOKIE_NAME);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isHydrating: false,
      });
    }
  },

  logout: () => {
    Cookies.remove(JWT_COOKIE_NAME);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  },
}));
