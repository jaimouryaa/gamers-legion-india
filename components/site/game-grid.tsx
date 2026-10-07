"use client";

import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { GameCard } from "@/components/site/game-card";
import { GameDetailsModal } from "@/components/site/game-details-modal";
import type { Game } from "@/lib/types";

// 2 columns on phones with a tighter gap; sm and up keep the original layout.
const GRID_CLASSES = "grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4";

export function GameGrid({ games }: { games: Game[] }) {
  const [active, setActive] = useState<Game | null>(null);

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-glass-strong py-20 text-center">
        <SearchX size={28} className="text-text-muted" />
        <p className="font-display text-lg font-medium text-text-primary">No games found</p>
        <p className="max-w-sm text-sm text-text-muted">
          Try searching for another title, genre, or platform.
        </p>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
    <>
      <div className={GRID_CLASSES}>
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            className="min-w-0"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 230, damping: 25, delay: Math.min(i, 7) * 0.055 }}
          >
            <GameCard game={game} onOpen={setActive} />
          </motion.div>
        ))}
      </div>
      <GameDetailsModal game={active} onClose={() => setActive(null)} />
    </>
    </MotionConfig>
  );
}

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID_CLASSES}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="aspect-[4/3] animate-pulse bg-white/5" />
          <div className="flex flex-col gap-1.5 p-2.5 sm:gap-2.5 sm:p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
