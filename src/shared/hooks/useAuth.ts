import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authApi, type LoginRequest } from "../api/auth.service";
import { useAuthStore } from "../store/auth.store";

const JWT_COOKIE_NAME = "auth_token";

export const useLogin = () => {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      const token = response.accessToken;

      Cookies.set(JWT_COOKIE_NAME, token, {
        expires: 7,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      setToken(token);

      try {
        const user = await authApi.me(token);
        setUser(user);
        router.push("/dashboard/users");
      } catch (error) {
        Cookies.remove(JWT_COOKIE_NAME, { path: "/" });
        setToken(null);
        setUser(null);
        throw error;
      }
    },
  });
};

export const useAuthMe = () => {
  const cookieToken = Cookies.get(JWT_COOKIE_NAME) ?? null;
  const storeToken = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    if (cookieToken && !storeToken) {
      setToken(cookieToken);
    }
  }, [cookieToken, storeToken, setToken]);

  const token = cookieToken || storeToken;

  return useQuery({
    queryKey: ["auth", "me", token],
    enabled: Boolean(token),
    retry: false,
    queryFn: async () => {
      if (!token) return null;

      try {
        const user = await authApi.me(token);
        setUser(user);
        setToken(token);
        return user;
      } catch (error) {
        Cookies.remove(JWT_COOKIE_NAME, { path: "/" });
        setUser(null);
        setToken(null);
        throw error;
      }
    },
  });
};
