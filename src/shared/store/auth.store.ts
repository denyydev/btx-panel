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

  logout: () => Promise<void>;
}

const JWT_COOKIE_NAME = "auth_token";

// Надежная функция для удаления cookie
const removeAuthCookie = () => {
  // Пробуем удалить через js-cookie с разными параметрами
  Cookies.remove(JWT_COOKIE_NAME, { path: "/" });
  Cookies.remove(JWT_COOKIE_NAME, { path: "/", sameSite: "lax" });
  Cookies.remove(JWT_COOKIE_NAME, { path: "/", sameSite: "strict" });
  Cookies.remove(JWT_COOKIE_NAME);
  
  // Устанавливаем cookie с истекшим сроком с теми же параметрами
  Cookies.set(JWT_COOKIE_NAME, "", {
    expires: -1,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  
  // Также пробуем удалить через document.cookie напрямую
  if (typeof document !== "undefined") {
    const hostname = window.location.hostname;
    // Удаляем с разными комбинациями domain и path
    document.cookie = `${JWT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    if (hostname) {
      document.cookie = `${JWT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    }
    document.cookie = `${JWT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
    document.cookie = `${JWT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isHydrating: true,

  setToken: (token: string | null) => {
    if (token) {
      Cookies.set(JWT_COOKIE_NAME, token, {
        expires: 7,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      removeAuthCookie();
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
      removeAuthCookie();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isHydrating: false,
      });
    }
  },

  logout: async () => {
    // Сначала очищаем локально
    removeAuthCookie();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrating: false,
    });
    
    // Затем вызываем серверный API для гарантированного удаления cookie
    try {
      await authApi.logout();
    } catch (error) {
      // Игнорируем ошибки, так как локально уже очистили
      console.error('Logout API error:', error);
    }
  },
}));
