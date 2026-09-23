"use client";

import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArcadeReveal } from "@/components/site/arcade-reveal";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { GameDetailsModal } from "@/components/site/game-details-modal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Game } from "@/lib/types";

export function RecentlyAdded({ games }: { games: Game[] }) {
  const [active, setActive] = useState<Game | null>(null);
  if (games.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ArcadeReveal>
        <SectionHeading eyebrow="Fresh drops" title="Recently added" viewAllHref="/games" />
      </ArcadeReveal>
      <MotionConfig reducedMotion="user">
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {games.slice(0, 12).map((game, i) => (
          <motion.button
            key={game.id}
            onClick={() => setActive(game)}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ type: "spring", stiffness: 230, damping: 25, delay: Math.min(i, 7) * 0.045 }}
            className="arcade-card glass-panel flex w-40 shrink-0 flex-col overflow-hidden rounded-xl text-left hover:border-accent-cyan/40 sm:w-auto"
          >
            <div className="relative aspect-square">
              <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} fit="contain" />
              {game.discountPercentage > 0 && (
                <div className="absolute left-2 top-2">
                  <DiscountBadge percentage={game.discountPercentage} className="px-2 py-0.5 text-[10px]" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 p-3">
              <p className="truncate text-xs font-medium text-text-primary">{game.title}</p>
              <Price original={game.originalPrice} sale={game.salePrice} size="sm" />
            </div>
          </motion.button>
        ))}
        </div>
      </MotionConfig>
      <GameDetailsModal game={active} onClose={() => setActive(null)} />
    </section>
  );
}
