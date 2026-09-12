"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { CoverArt } from "@/components/ui/cover-art";
import { formatINR, buildWhatsAppCartLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, close, removeItem, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="glass-panel fixed right-0 top-0 z-[80] flex h-full w-full max-w-sm flex-col border-l"
          >
            <div className="flex items-center justify-between border-b border-border-glass px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Your cart</h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="font-display text-base font-medium text-text-primary">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-text-muted">
                    Browse the catalog and add a few games you like.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-border-glass bg-surface p-2.5"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <CoverArt title={item.title} genre={item.genre} imageUrl={item.coverImage} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold text-accent-primary">
                          {formatINR(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="self-start rounded-full p-1.5 text-text-muted hover:bg-white/5 hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border-glass px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Total</span>
                  <span className="font-display text-lg font-semibold">{formatINR(total)}</span>
                </div>
                <a href={buildWhatsAppCartLink(items)} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" size="lg">
                    <MessageCircle size={17} />
                    Checkout on WhatsApp
                  </Button>
                </a>
                <p className="mt-2 text-center text-xs text-text-muted">
                  You&apos;ll be redirected to WhatsApp to confirm your order.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
