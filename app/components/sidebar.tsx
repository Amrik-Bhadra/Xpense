'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Wallet } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-(--sidebar-bg) text-(--sidebar-text) flex flex-col border-r border-(--sidebar-border)">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-(--sidebar-border)">
        <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
          <Wallet size={16} className="text-white" />
        </div>
        <span className="text-white font-semibold tracking-tight">Xpense</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "text-(--sidebar-text-active) bg-white/5"
                  : "hover:text-(--sidebar-text-active) hover:bg-white/5"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-full bg-brand" />
              )}
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-(--sidebar-border) text-xs">
        Local · PostgreSQL
      </div>
    </aside>
  );
}