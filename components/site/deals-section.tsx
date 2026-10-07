"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArcadeReveal } from "@/components/site/arcade-reveal";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { Countdown } from "@/components/ui/countdown";
import { GameDetailsModal } from "@/components/site/game-details-modal";
import { useWishlist } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

// `deals` must already be filtered to non-expired games by the caller
// (a Server Component) — filtering by Date.now() inside a client
// component's render body would be an impure render.
export function DealsSection({ deals }: { deals: Game[] }) {
  const [active, setActive] = useState<Game | null>(null);
  const { isWishlisted, toggle } = useWishlist();
  if (deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ArcadeReveal>
        <SectionHeading
          eyebrow="Act fast"
          title="Limited-time deals"
          subtitle="Don't miss out. These deals won't last forever."
          viewAllHref="/deals"
        />
      </ArcadeReveal>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {deals.slice(0, 8).map((game, i) => {
          const wishlisted = isWishlisted(game.id);
          return (
            <ArcadeReveal key={game.id} delay={Math.min(i, 7) * 0.055} className="h-full">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActive(game)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(game);
                }
              }}
              className="arcade-card glass-panel flex h-full cursor-pointer flex-col overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-accent-magenta/40 sm:rounded-2xl"
            >
              <div className="relative aspect-[4/3]">
                <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} fit="contain" />
                <div className="absolute right-1.5 top-1.5 origin-top-right scale-[0.82] sm:right-3 sm:top-3 sm:scale-100">
                  <DiscountBadge percentage={game.discountPercentage} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle({
                      id: game.id,
                      title: game.title,
                      slug: game.slug,
                      price: game.salePrice,
                      originalPrice: game.originalPrice,
                      coverImage: game.coverImage,
                      genre: game.genre,
                    });
                  }}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={wishlisted}
                  className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 sm:left-3 sm:top-3 sm:h-8 sm:w-8"
                >
                  <Heart size={14} className={cn("h-3 w-3 sm:h-[15px] sm:w-[15px]", wishlisted && "fill-accent-magenta text-accent-magenta")} />
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-1.5 p-2.5 sm:gap-2.5 sm:p-4">
                <div>
                  <h3 className="line-clamp-2 font-display text-xs font-semibold leading-snug text-text-primary sm:text-sm">{game.title}</h3>
                  <div className="mt-1 origin-left max-sm:scale-[0.85]">
                    <Rating value={game.rating} count={game.reviewCount} />
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-1 sm:gap-1.5">
                  <div className="origin-bottom-left max-sm:scale-[0.9]">
                    <Price original={game.originalPrice} sale={game.salePrice} />
                  </div>
                  {game.dealExpiry && (
                    <div className="origin-left max-sm:scale-[0.85] max-sm:-mt-1">
                      <Countdown expiresAt={game.dealExpiry} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            </ArcadeReveal>
          );
        })}
      </div>
      <GameDetailsModal game={active} onClose={() => setActive(null)} />
    </section>
  );
}
