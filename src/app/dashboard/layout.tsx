"use client";

import { useAuthMe } from "@/shared/hooks/useAuth";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/store/auth.store";
import { AppSidebar } from "@/shared/ui/AppSidebar/AppSidebar";
import Cookies from "js-cookie";
import { Home, LogOut, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const JWT_COOKIE_NAME = "auth_token";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const userInStore = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logoutStore = useAuthStore((s) => s.logout);

  useSocket();

  useEffect(() => {
    const cookieToken = Cookies.get(JWT_COOKIE_NAME) || null;
    if (cookieToken && !token) setToken(cookieToken);
    if (!cookieToken && token) setToken(null);
  }, [token, setToken]);

  const { isLoading, isError, data } = useAuthMe();

  useEffect(() => {
    if (!data) return;
    const u: any = (data as any)?.user || data;
    if (u && !userInStore) setUser(u);
  }, [data, userInStore, setUser]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (!isLoading && isError) {
      logoutStore();
      router.push("/login");
    }
  }, [token, isLoading, isError, router, logoutStore]);

  if (!token || isLoading) return null;

  const user: any = userInStore || (data as any)?.user || data;
  if (!user) return null;

  const fullName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Пользователь";

  const email = user?.email || "";
  const avatar = user?.image || "";

  const logout = () => {
    logoutStore();
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const Item = ({
    href,
    label,
    icon: Icon,
    active,
  }: {
    href: string;
    label: string;
    icon: ReactNode;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={[
        "w-[102px] h-[44px] flex flex-col items-center justify-center gap-2",
        active ? "text-[#006FEE]" : "text-[#11181C]",
      ].join(" ")}
    >
      <span className="h-[18px] w-[18px]">{Icon}</span>
      <span className="text-[12px] leading-4">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen w-full bg-[#E6F1FE] flex">
      <div className="hidden lg:block">
        <AppSidebar />
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
                  {avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
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
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-0 lg:p-20">{children}</main>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#E6F1FE] border-t border-[rgba(0,111,238,0.2)] px-[2px] py-2">
          <div className="mx-auto h-[44px] flex items-center justify-between">
            <Item
              href="/dashboard"
              label="Главная"
              icon={<Home size={18} />}
              active={isActive("/dashboard")}
            />
            <Item
              href="/users"
              label="Пользователи"
              icon={<Users size={18} />}
              active={isActive("/users")}
            />
            <Item
              href="/user"
              label="Профиль"
              icon={<User size={18} />}
              active={isActive("/user")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
