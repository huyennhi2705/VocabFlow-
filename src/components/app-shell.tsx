"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Tổng quan", icon: "◫" },
  { href: "/decks", label: "Bộ từ", icon: "▤" },
  { href: "/study", label: "Flashcard", icon: "▱" },
  { href: "/quiz", label: "Quiz", icon: "✦" }
];

export function AppShell({
  email,
  children
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link href="/dashboard" className="sidebar-brand mb-10 flex items-center gap-3 px-2">
          <span className="brand-mark">V</span>
          <span className="text-xl font-extrabold tracking-tight">VocabFlow</span>
        </Link>
        <nav className="nav-items">
          {links.map((link) => (
            <Link key={link.href} className={`nav-link ${pathname === link.href || pathname.startsWith(`${link.href}/`) ? "active" : ""}`} href={link.href}>
              <span className="text-lg">{link.icon}</span><span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-user mt-auto border-t border-slate-100 pt-5">
          <p className="truncate text-sm font-bold">{email}</p>
          <form action={logoutAction}><button className="mt-2 text-sm font-semibold text-slate-500 hover:text-brand">Đăng xuất ↗</button></form>
        </div>
      </aside>
      <main className="main-area">{children}</main>
    </div>
  );
}
