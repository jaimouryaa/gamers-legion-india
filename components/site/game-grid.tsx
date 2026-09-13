"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { GameCard } from "@/components/site/game-card";
import { GameDetailsModal } from "@/components/site/game-details-modal";
import type { Game } from "@/lib/types";

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
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
          >
            <GameCard game={game} onOpen={setActive} />
          </motion.div>
        ))}
      </div>
      <GameDetailsModal game={active} onClose={() => setActive(null)} />
    </>
  );
}

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel overflow-hidden rounded-2xl">
          <div className="aspect-[4/3] animate-pulse bg-white/5" />
          <div className="flex flex-col gap-2.5 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
