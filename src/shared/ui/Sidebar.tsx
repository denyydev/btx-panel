"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconPosts({ active }: { active?: boolean }) {
  const stroke = active ? "#006FEE" : "#000000";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M7 19h12" stroke={stroke} strokeWidth="1.5" />
      <path d="M9 7h8" stroke={stroke} strokeWidth="1.5" />
      <path d="M9 11h8" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function IconAdmins({ active }: { active?: boolean }) {
  const stroke = active ? "#006FEE" : "#000000";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M4 21a8 8 0 0 1 16 0" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function IconUsers({ active }: { active?: boolean }) {
  const stroke = active ? "#006FEE" : "#000000";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M2 21a8 8 0 0 1 14-5.2" stroke={stroke} strokeWidth="1.5" />
      <path d="M19 21v-6" stroke={stroke} strokeWidth="1.5" />
      <path d="M16 18h6" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 7V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1"
        stroke="#006FEE"
        strokeWidth="1.5"
      />
      <path d="M3 12h10" stroke="#006FEE" strokeWidth="1.5" />
      <path
        d="M7 8l-4 4 4 4"
        stroke="#006FEE"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/posts", label: "Публикации", Icon: IconPosts },
    { href: "/dashboard/admins", label: "Администраторы", Icon: IconAdmins },
    { href: "/dashboard/users", label: "Пользователи", Icon: IconUsers },
  ];

  return (
    <aside className="w-[288px] h-screen bg-white p-8 flex flex-col justify-between">
      <div className="w-full flex flex-col items-center gap-10">
        <div className="text-[#006FEE] font-semibold tracking-tight text-2xl leading-none select-none">
          BTX•
        </div>

        <nav className="w-[224px] flex flex-col gap-4">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "w-full h-10 rounded-[14px] px-4 flex items-center gap-2 text-[14px] leading-[20px] font-normal transition-colors",
                  isActive
                    ? "bg-[#CCE3FD] text-[#006FEE]"
                    : "text-black hover:bg-black/5",
                ].join(" ")}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <Icon active={isActive} />
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="w-[224px] mx-auto bg-[#E6F1FE] rounded-[12px] p-3 flex flex-col gap-[18px]">
        <div className="w-full flex items-start gap-2">
          <span className="w-10 h-10 rounded-full bg-[#A1A1AA]" />
          <div className="flex flex-col">
            <div className="text-[14px] leading-[20px] text-[#11181C]">
              Junior Garcia
            </div>
            <div className="text-[14px] leading-[20px] text-[#006FEE]">
              @jrgarciadev
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full h-10 rounded-[14px] bg-[#CCE3FD] px-4 flex items-center justify-center gap-2 text-[14px] leading-[20px] text-[#006FEE]"
        >
          <IconLogout />
          Выйти
        </button>
      </div>
    </aside>
  );
}
