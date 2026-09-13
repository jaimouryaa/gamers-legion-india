"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { useWishlist } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

export function GameCard({ game, onOpen }: { game: Game; onOpen: (game: Game) => void }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(game.id);

  // A real <button> (the wishlist heart) can't nest inside another
  // <button> per HTML rules, so the card itself is a div acting as a
  // button (role + keyboard handling) rather than motion.button.
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(game)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(game);
        }
      }}
      whileHover={{ y: -6, scale: 1.035 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group glass-panel flex cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-colors hover:border-accent-cyan/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
          <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        {game.discountPercentage > 0 && (
          <div className="absolute right-3 top-3">
            <DiscountBadge percentage={game.discountPercentage} />
          </div>
        )}
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
        <h3 className="font-display text-base font-semibold leading-snug text-text-primary">
          {game.title}
        </h3>
        <p className="text-xs text-text-muted">{game.genre.slice(0, 3).join(" · ")}</p>
        <Rating value={game.rating} count={game.reviewCount} />
        <div className="mt-1 flex items-end justify-between gap-2">
          <Price original={game.originalPrice} sale={game.salePrice} />
          <span className="flex items-center gap-1 text-xs font-medium text-accent-cyan opacity-0 transition-opacity group-hover:opacity-100">
            Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
