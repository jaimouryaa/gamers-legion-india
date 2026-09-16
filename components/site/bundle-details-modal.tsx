"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageCircle, Layers } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { buildWhatsAppBundleLink, formatINR } from "@/lib/utils";
import type { Bundle, Game } from "@/lib/types";

export function BundleDetailsModal({
  bundle,
  games,
  onClose,
}: {
  bundle: Bundle | null;
  games: Game[];
  onClose: () => void;
}) {
  useEffect(() => {
    if (!bundle) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [bundle, onClose]);

  const includedGames = bundle
    ? bundle.gameIds.map((id) => games.find((g) => g.id === id)).filter((g): g is Game => !!g)
    : [];

  return (
    <AnimatePresence>
      {bundle && (
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
            aria-label={bundle.name}
            className="glass-panel relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border sm:rounded-3xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
            >
              <X size={18} />
            </button>

            <div className="relative h-48 shrink-0 sm:h-56">
              <CoverArt title={bundle.name} imageUrl={bundle.bannerImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
            </div>

            <div className="overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="-mt-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                    {bundle.name}
                  </h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-muted">
                    <Layers size={13} />
                    {bundle.gameIds.length} games included
                  </p>
                </div>
                {bundle.discountPercentage > 0 && <DiscountBadge percentage={bundle.discountPercentage} />}
              </div>

              {bundle.rating != null && (
                <div className="mt-4">
                  <Rating value={bundle.rating} size="md" />
                </div>
              )}

              <p className="mt-5 text-sm leading-relaxed text-text-secondary">{bundle.description}</p>

              {includedGames.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    What&apos;s included
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {includedGames.map((game) => (
                      <li
                        key={game.id}
                        className="flex items-center gap-3 rounded-xl border border-border-glass bg-surface/60 p-2.5"
                      >
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                          <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">{game.title}</p>
                          <p className="text-xs text-text-muted">{game.genre.slice(0, 2).join(" · ")}</p>
                        </div>
                        <span className="shrink-0 text-xs text-text-muted line-through">
                          {formatINR(game.salePrice)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border-glass bg-surface/60 p-5">
                <div>
                  <Price original={bundle.originalPrice} sale={bundle.bundlePrice} size="lg" />
                  {bundle.savings > 0 && (
                    <p className="mt-1 text-xs font-medium text-success">
                      You save {formatINR(bundle.savings)}
                    </p>
                  )}
                </div>
                <a
                  href={buildWhatsAppBundleLink({
                    name: bundle.name,
                    price: bundle.bundlePrice,
                    slug: bundle.slug,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <MessageCircle size={16} />
                    Buy bundle via WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
