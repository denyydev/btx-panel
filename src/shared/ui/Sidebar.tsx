"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/sidebar.module.scss";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/posts", label: "Публикации" },
    { href: "/dashboard/admins", label: "Администраторы" },
    { href: "/dashboard/users", label: "Пользователи" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__logo}>Admin Panel</div>
      <nav className={styles.sidebar__nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.sidebar__navItem} ${
                isActive ? styles.sidebar__navItemActive : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
