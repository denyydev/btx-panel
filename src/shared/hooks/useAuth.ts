import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi, LoginRequest } from '../api/auth.service';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => {
    return (user: typeof state.user) => {
      state.user = user;
      state.isAuthenticated = !!user;
    };
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      Cookies.set('auth_token', response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setUser(response.user);

      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};

