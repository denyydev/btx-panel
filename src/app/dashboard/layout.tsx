'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Sidebar } from '@/shared/ui/Sidebar';
import { useAuthStore } from '@/shared/store/auth.store';
import { useSocket } from '@/shared/hooks/useSocket';
import { useAuthMe } from '@/shared/hooks/useAuth';

const JWT_COOKIE_NAME = 'auth_token';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutStore = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  const logout = () => {
    logoutStore();
    router.push('/login');
  };

  useSocket();
  const { isLoading, isError } = useAuthMe();

  useEffect(() => {
    const cookieToken = Cookies.get(JWT_COOKIE_NAME);
    if (cookieToken && !token) {
      setToken(cookieToken);
    }
  }, [token, setToken]);

  useEffect(() => {
    if (!isLoading) {
      if (isError || (!isAuthenticated && !token)) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, token, isLoading, isError, router]);

  if (isLoading || (!isAuthenticated && !token)) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto ml-[250px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Выйти
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

