"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingCart, Heart, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, CONNECT } from "@/lib/config";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { ConnectDropdown } from "@/components/site/connect-dropdown";
import { InstagramIcon } from "@/components/ui/social-icons";
import { buildWhatsAppGeneralLink } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { count, open: openCart } = useCart();
  const { count: wishlistCount, open: openWishlist } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile/search overlays when the route changes. Adjusting state
  // during render (rather than in an effect) avoids the extra render pass
  // React's "set-state-in-effect" rule warns about.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/games?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border-glass bg-void/95 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.6)]"
          : "border-border-glass bg-void/90"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Gamers Legion India home"
          className="group flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
        >
          <svg
            viewBox="23 27 545 105"
            role="img"
            aria-label="Gamers Legion India"
            className="w-28 transition-transform duration-200 group-hover:scale-[1.04] sm:w-44 lg:w-48 xl:w-52"
          >
            <defs>
              <filter id="navbar-logo-transparent-black" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.9 0.9 0.9 0 0"
                />
              </filter>
            </defs>
            <image
              href="/navbar-wordmark.png"
              width="630"
              height="153"
              filter="url(#navbar-logo-transparent-black)"
            />
          </svg>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/5 text-text-primary" : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ConnectDropdown />
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className={cn("nav-action flex h-10 w-10 items-center justify-center", searchOpen && "nav-action-primary")}
          >
            <Search size={18} />
          </button>
          <button
            aria-label={`Wishlist, ${wishlistCount} games`}
            onClick={openWishlist}
            className="nav-action relative flex h-10 w-10 items-center justify-center"
          >
            <Heart size={18} className={wishlistCount > 0 ? "fill-accent-magenta text-accent-magenta" : undefined} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-magenta px-1 text-[10px] font-bold text-[#fdf1f3]">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            aria-label={`Cart, ${count} items`}
            onClick={openCart}
            className="nav-action nav-action-primary relative flex h-10 w-10 items-center justify-center"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-[10px] font-bold text-[#fdf1f3]">
                {count}
              </span>
            )}
          </button>
          <Link
            href="/admin"
            aria-label="Account"
            className="nav-action hidden h-10 w-10 items-center justify-center sm:flex"
          >
            <User size={18} />
          </Link>
          <button
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn("nav-action flex h-10 w-10 items-center justify-center lg:hidden", mobileOpen && "nav-action-primary")}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border-glass bg-void/95 backdrop-blur-xl"
          >
            <form onSubmit={submitSearch} className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 rounded-full border border-border-glass-strong bg-surface px-4 py-2.5 focus-within:border-accent-primary/60">
                <Search size={16} className="text-text-muted shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games, genres, platforms..."
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border-glass bg-void/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                Admin
              </Link>
              <div className="my-2 border-t border-border-glass" />
              <a
                href={CONNECT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                <InstagramIcon size={16} className="text-accent-magenta" />
                Instagram
              </a>
              <a
                href={buildWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                <MessageCircle size={16} className="text-success" />
                WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
