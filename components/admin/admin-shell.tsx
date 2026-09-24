"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";

export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void">
      <div className="hidden w-64 shrink-0 border-r border-border-glass bg-surface/40 lg:fixed lg:inset-y-0 lg:flex">
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border-glass bg-surface lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5"
              >
                <X size={17} />
              </button>
              <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-glass bg-void/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span className="hidden sm:inline">{adminEmail}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary/15 text-xs font-semibold text-accent-primary">
              {adminEmail.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
