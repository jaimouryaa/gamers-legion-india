"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { Countdown } from "@/components/ui/countdown";
import { GameDetailsModal } from "@/components/site/game-details-modal";
import type { Game } from "@/lib/types";

// `deals` must already be filtered to non-expired games by the caller
// (a Server Component) — filtering by Date.now() inside a client
// component's render body would be an impure render.
export function DealsSection({ deals }: { deals: Game[] }) {
  const [active, setActive] = useState<Game | null>(null);
  if (deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Act fast"
        title="Limited-time deals"
        subtitle="Don't miss out. These deals won't last forever."
        viewAllHref="/deals"
      />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {deals.slice(0, 8).map((game) => (
          <button
            key={game.id}
            onClick={() => setActive(game)}
            className="glass-panel flex flex-col overflow-hidden rounded-2xl text-left transition-colors hover:border-accent-magenta/40"
          >
            <div className="relative aspect-[4/3]">
              <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} />
              <div className="absolute right-3 top-3">
                <DiscountBadge percentage={game.discountPercentage} />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2.5 p-4">
              <h3 className="font-display text-sm font-semibold text-text-primary">{game.title}</h3>
              <Rating value={game.rating} count={game.reviewCount} />
              <Price original={game.originalPrice} sale={game.salePrice} />
              {game.dealExpiry && <Countdown expiresAt={game.dealExpiry} />}
            </div>
          </button>
        ))}
      </div>
      <GameDetailsModal game={active} onClose={() => setActive(null)} />
    </section>
  );
}
