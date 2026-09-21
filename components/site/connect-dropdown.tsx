"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/social-icons";
import { CONNECT } from "@/lib/config";
import { buildWhatsAppGeneralLink, cn } from "@/lib/utils";

export function ConnectDropdown({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
          open ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
        )}
      >
        Connect
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-panel absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border p-1.5 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)]"
          >
            <a
              href={CONNECT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-accent-magenta">
                <InstagramIcon size={16} />
              </span>
              Instagram
            </a>
            <a
              href={buildWhatsAppGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-success">
                <MessageCircle size={16} />
              </span>
              WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
