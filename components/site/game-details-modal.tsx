"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageCircle, ShoppingCart, Clock } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { Countdown } from "@/components/ui/countdown";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { buildWhatsAppLink, formatINR } from "@/lib/utils";
import type { Game } from "@/lib/types";

export function GameDetailsModal({
  game,
  onClose,
}: {
  game: Game | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();

  useEffect(() => {
    if (!game) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [game, onClose]);

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm p-0 sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={game.title}
            className="glass-panel relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border sm:rounded-3xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
            >
              <X size={18} />
            </button>

            <div className="relative h-40 shrink-0 sm:h-64">
              <CoverArt title={game.title} genre={game.genre} imageUrl={game.bannerImage ?? game.coverImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            </div>

            <div className="overflow-y-auto px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                    {game.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-text-muted">{game.genre.join(" · ")}</p>
                </div>
                {game.discountPercentage > 0 && <DiscountBadge percentage={game.discountPercentage} />}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Rating value={game.rating} count={game.reviewCount} size="md" />
                <div className="flex flex-wrap gap-1.5">
                  {game.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-text-secondary"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-5 max-h-28 overflow-y-auto pr-1 text-sm leading-relaxed text-text-secondary sm:max-h-36">
                {game.description}
              </p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border-glass bg-surface/60 p-5">
                <div>
                  <Price original={game.originalPrice} sale={game.salePrice} size="lg" />
                  {game.savings > 0 && (
                    <p className="mt-1 text-xs font-medium text-success">
                      You save {formatINR(game.savings)}
                    </p>
                  )}
                  {game.dealExpiry && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                      <Clock size={13} />
                      <Countdown expiresAt={game.dealExpiry} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-wrap gap-2.5 sm:flex-none">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      addItem({
                        id: game.id,
                        title: game.title,
                        slug: game.slug,
                        price: game.salePrice,
                        originalPrice: game.originalPrice,
                        coverImage: game.coverImage,
                        genre: game.genre,
                      });
                      onClose();
                    }}
                  >
                    <ShoppingCart size={16} />
                    Add to cart
                  </Button>
                  <a
                    href={buildWhatsAppLink({ gameTitle: game.title, price: game.salePrice, slug: game.slug })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <MessageCircle size={16} />
                      Buy via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
