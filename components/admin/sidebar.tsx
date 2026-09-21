"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gamepad2, Package, ImageIcon, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/login/actions";

const LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Games", href: "/admin/games", icon: Gamepad2, exact: false },
  { label: "Bundles", href: "/admin/bundles", icon: Package, exact: false },
  { label: "Proofs", href: "/admin/proofs", icon: ImageIcon, exact: false },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          {/* eslint-disable-next-line @next/next/no-img-element -- small
              static brand asset from /public, not worth next/image here */}
          <img src="/logo.png" alt="Gamers Legion India" className="h-8 w-auto" />
          <span className="rounded-full border border-border-glass px-1.5 py-0.5 text-[9px] font-medium tracking-[0.2em] text-text-muted">
            ADMIN
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              )}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-glass p-3">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-danger"
          >
            <LogOut size={17} />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export function MobileSidebarClose() {
  return <X size={18} />;
}
