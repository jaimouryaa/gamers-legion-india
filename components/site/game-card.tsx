"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import type { Game } from "@/lib/types";

export function GameCard({ game, onOpen }: { game: Game; onOpen: (game: Game) => void }) {
  return (
    <motion.button
      onClick={() => onOpen(game)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group glass-panel flex flex-col overflow-hidden rounded-2xl text-left transition-colors hover:border-accent-primary/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        {game.discountPercentage > 0 && (
          <div className="absolute right-3 top-3">
            <DiscountBadge percentage={game.discountPercentage} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-text-primary">
          {game.title}
        </h3>
        <p className="text-xs text-text-muted">{game.genre.slice(0, 3).join(" · ")}</p>
        <Rating value={game.rating} count={game.reviewCount} />
        <div className="mt-1 flex items-end justify-between gap-2">
          <Price original={game.originalPrice} sale={game.salePrice} />
          <span className="flex items-center gap-1 text-xs font-medium text-accent-primary opacity-0 transition-opacity group-hover:opacity-100">
            Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
