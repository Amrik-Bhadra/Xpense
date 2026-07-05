"use client";

import { useState } from "react";
import { Menu, Wallet, X } from "lucide-react";
import Sidebar from "./sidebar";

type AppShellProps = {
  user: { name: string; email: string };
  children: React.ReactNode;
};

export default function AppShell({ user, children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-(--app-bg)">
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          user={user}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((value) => !value)}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-sm md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-border bg-surface p-2 text-muted"
            aria-label="Open sidebar"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
              <Wallet size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Xpense</span>
          </div>
        </div>

        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
}
