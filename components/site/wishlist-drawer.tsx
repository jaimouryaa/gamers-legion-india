"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, MessageCircle, ShoppingCart, Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { CoverArt } from "@/components/ui/cover-art";
import { formatINR, buildWhatsAppCartLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function WishlistDrawer() {
  const { items, isOpen, close, remove } = useWishlist();
  const { addItem } = useCart();

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
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Heart size={17} className="fill-accent-magenta text-accent-magenta" />
                Wishlist
              </h2>
              <button
                onClick={close}
                aria-label="Close wishlist"
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <Heart size={24} className="text-text-muted" />
                  <p className="font-display text-base font-medium text-text-primary">
                    Your wishlist is empty
                  </p>
                  <p className="text-sm text-text-muted">
                    Tap the heart on any game to save it for later.
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
                        <CoverArt title={item.title} genre={item.genre} imageUrl={item.coverImage} fit="contain" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold text-accent-cyan">
                          {formatINR(item.price)}
                        </p>
                        <button
                          onClick={() =>
                            addItem({
                              id: item.id,
                              title: item.title,
                              slug: item.slug,
                              price: item.price,
                              originalPrice: item.originalPrice,
                              coverImage: item.coverImage,
                              genre: item.genre,
                            })
                          }
                          className="mt-1 flex w-fit items-center gap-1 text-xs font-medium text-accent-cyan hover:underline"
                        >
                          <ShoppingCart size={12} />
                          Move to cart
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.title} from wishlist`}
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
                <a href={buildWhatsAppCartLink(items)} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full" size="lg">
                    <MessageCircle size={17} />
                    Checkout wishlist on WhatsApp
                  </Button>
                </a>
                <p className="mt-2 text-center text-xs text-text-muted">
                  All {items.length} {items.length === 1 ? "game" : "games"} will be included in
                  one message.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
