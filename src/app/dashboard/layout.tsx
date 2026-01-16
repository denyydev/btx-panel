"use client";

import { useAuthMe } from "@/shared/hooks/useAuth";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/store/auth.store";
import { Sidebar } from "@/shared/ui/Sidebar/Sidebar";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const JWT_COOKIE_NAME = "auth_token";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutStore = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  const logout = () => {
    logoutStore();
    router.push("/login");
  };

  useSocket();
  const { isLoading, isError, data } = useAuthMe();

  useEffect(() => {
    const cookieToken = Cookies.get(JWT_COOKIE_NAME);
    if (cookieToken && !token) setToken(cookieToken);
  }, [token, setToken]);

  useEffect(() => {
    if (!isLoading && (isError || (!isAuthenticated && !token))) {
      router.push("/login");
    }
  }, [isAuthenticated, token, isLoading, isError, router]);

  if (isLoading || (!isAuthenticated && !token)) return null;

  const user: any = (data as any)?.user || data;
  const fullName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Пользователь";
  const email = user?.email || "";
  const avatar = user?.image || "";

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const Item = ({
    href,
    label,
    icon,
    active,
  }: {
    href: string;
    label: string;
    icon: string;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={[
        "w-[102px] h-[44px] flex flex-col items-center justify-center gap-2",
        active ? "text-[#006FEE]" : "text-[#11181C]",
      ].join(" ")}
    >
      <span className="text-[18px] leading-none">{icon}</span>
      <span className="text-[12px] leading-4">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen w-full bg-[#E6F1FE] flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-50 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-b-[12px] px-5 pt-5 pb-4">
          <div className="flex items-center gap-5">
            <div className="w-[74px] h-[18.5px] flex items-center font-semibold text-[#006FEE]">
              BTX•
            </div>

            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#A1A1AA] overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="text-[12px] leading-4 font-medium text-[#11181C] truncate">
                    {fullName}
                  </div>
                  <div className="text-[12px] leading-4 font-normal text-[#006FEE] truncate">
                    {email}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-8 h-8 rounded-lg bg-[#CCE3FD] flex items-center justify-center text-[#006FEE]"
                aria-label="logout"
              >
                ⎋
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-0 py-5 lg:px-20 lg:py-20 lg:pb-20 pb-[60px]">
          <div className="lg:block hidden">{children}</div>
          <div className="lg:hidden">{children}</div>
        </main>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#E6F1FE] border-t border-[rgba(0,111,238,0.2)] px-[2px] py-2">
          <div className="mx-auto h-[44px] flex items-center justify-between">
            <Item
              href="/dashboard"
              label="Главная"
              icon="🏠"
              active={isActive("/dashboard")}
            />
            <Item
              href="/users"
              label="Пользователи"
              icon="👥"
              active={isActive("/users")}
            />
            <Item
              href="/user"
              label="Профиль"
              icon="👤"
              active={isActive("/user")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
