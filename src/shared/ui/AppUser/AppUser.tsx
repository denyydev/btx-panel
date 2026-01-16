"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AppUser = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Пользователь";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="mx-auto flex w-[224px] flex-col gap-[18px] rounded-[12px] bg-[#E6F1FE] p-3">
      <div className="flex w-full items-start gap-2">
        {user?.image ? (
          <img
            src={user.image}
            alt={user?.username || ""}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="h-10 w-10 rounded-full bg-[#A1A1AA]" />
        )}

        <div className="flex min-w-0 flex-col">
          <div className="truncate text-[14px] leading-[20px] text-[#11181C]">
            {fullName}
          </div>
          <Link
            href="/dashboard/me"
            className="truncate text-[14px] leading-[20px] text-[#006FEE] hover:underline"
          >
            {user?.username ? `@${user.username}` : "—"}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] bg-[#CCE3FD] px-4 text-[14px] leading-[20px] text-[#006FEE]"
      >
        <LogOut size={18} strokeWidth={1.5} />
        Выйти
      </button>
    </div>
  );
};

export default AppUser;
