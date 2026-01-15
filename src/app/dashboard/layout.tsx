"use client";

import { useAuthMe } from "@/shared/hooks/useAuth";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/store/auth.store";
import { Sidebar } from "@/shared/ui/Sidebar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const JWT_COOKIE_NAME = "auth_token";

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
    router.push("/login");
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
        router.push("/login");
      }
    }
  }, [isAuthenticated, token, isLoading, isError, router]);

  if (isLoading || (!isAuthenticated && !token)) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main
        className="flex-1 ml-[250px] p-6 overflow-y-auto"
        style={{ position: "relative" }}
      >
        {children}
      </main>
    </div>
  );
}
