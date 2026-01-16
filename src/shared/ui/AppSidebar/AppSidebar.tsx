"use client";

import { FileText, Shield, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppUser from "../AppUser/AppUser";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard/posts",
      label: "Публикации",
      Icon: FileText,
    },
    {
      href: "/dashboard/admins",
      label: "Администраторы",
      Icon: Shield,
    },
    {
      href: "/dashboard/users",
      label: "Пользователи",
      Icon: Users,
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-[288px] flex-col justify-between bg-white p-8">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="select-none text-2xl font-semibold leading-none tracking-tight text-[#006FEE]">
          BTX•
        </div>

        <nav className="flex w-[224px] flex-col gap-4">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex h-10 w-full items-center gap-2 rounded-[14px] px-4 text-[14px] leading-[20px] transition-colors",
                  isActive
                    ? "bg-[#CCE3FD] text-[#006FEE]"
                    : "text-black hover:bg-black/5",
                ].join(" ")}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={isActive ? "text-[#006FEE]" : "text-black"}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <AppUser />
    </aside>
  );
}
