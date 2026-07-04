"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Wallet, LogOut } from "lucide-react";
import ConfirmModal from "@/app/components/confirm-modal";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Expenses", icon: Receipt },
];

type Props = {
  user: { name: string; email: string };
};

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <aside className="w-60 shrink-0 h-screen bg-(--sidebar-bg) text-(--sidebar-text) flex flex-col border-r border-(--sidebar-border)">
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

      <div className="px-4 py-4 border-t border-(--sidebar-border)">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-white">
              {initials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--sidebar-text-active) truncate">
              {user.name}
            </p>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-(--sidebar-text) hover:text-(--sidebar-text-active) transition-colors shrink-0 cursor-pointer"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        isPending={isPending}
        variant="brand"
        icon={LogOut}
        title="Log out?"
        description="You'll need to log in again to access your dashboard."
        confirmLabel="Log out"
      />
    </aside>
  );
}