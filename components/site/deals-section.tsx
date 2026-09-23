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
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              className="arcade-card glass-panel flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-accent-magenta/40"
            >
              <div className="relative aspect-[4/3]">
                <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} fit="contain" />
                <div className="absolute right-3 top-3">
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
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                >
                  <Heart size={15} className={cn(wishlisted && "fill-accent-magenta text-accent-magenta")} />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <h3 className="font-display text-sm font-semibold text-text-primary">{game.title}</h3>
                <Rating value={game.rating} count={game.reviewCount} />
                <Price original={game.originalPrice} sale={game.salePrice} />
                {game.dealExpiry && <Countdown expiresAt={game.dealExpiry} />}
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
