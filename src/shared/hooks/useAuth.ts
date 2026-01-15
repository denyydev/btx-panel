import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest } from '../api/auth.service';
import { useAuthStore } from '../store/auth.store';
import Cookies from 'js-cookie';

const JWT_COOKIE_NAME = 'auth_token';

export const useLogin = () => {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      const token = response.accessToken;
      setToken(token);

      try {
        const user = await authApi.me(token);
        setUser(user);
        router.push('/dashboard/users');
      } catch (error) {
        setToken(null);
        throw error;
      }
    },
  });
};

export const useAuthMe = () => {
  const token = Cookies.get(JWT_COOKIE_NAME) || null;
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  return useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: async () => {
      if (!token) {
        setUser(null);
        setToken(null);
        return null;
      }
      try {
        const user = await authApi.me(token);
        setUser(user);
        setToken(token);
        return user;
      } catch (error) {
        setUser(null);
        setToken(null);
        Cookies.remove(JWT_COOKIE_NAME);
        throw error;
      }
    },
    enabled: !!token,
    retry: false,
  });
};
