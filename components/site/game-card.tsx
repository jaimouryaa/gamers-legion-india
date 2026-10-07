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
  //
  // Mobile (below the `sm` breakpoint) uses compact sizing so two cards fit
  // per row. Every mobile-only value is paired with an `sm:` value that
  // matches the original desktop design, so desktop is unchanged.
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
      className="arcade-card group glass-panel flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl text-left transition-colors hover:border-accent-cyan/40 sm:rounded-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
          <CoverArt title={game.title} genre={game.genre} imageUrl={game.coverImage} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        {game.discountPercentage > 0 && (
          <div className="absolute right-1.5 top-1.5 origin-top-right scale-[0.78] sm:right-3 sm:top-3 sm:scale-100">
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
          className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 sm:left-3 sm:top-3 sm:h-8 sm:w-8"
        >
          <Heart
            size={15}
            className={cn(
              "h-3 w-3 sm:h-[15px] sm:w-[15px]",
              wishlisted && "fill-accent-magenta text-accent-magenta"
            )}
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5 sm:gap-2.5 sm:p-4">
        <h3 className="line-clamp-2 font-display text-[13px] font-semibold leading-snug text-text-primary sm:line-clamp-none sm:text-base">
          {game.title}
        </h3>
        <p className="truncate text-[10px] text-text-muted sm:overflow-visible sm:whitespace-normal sm:text-xs">
          {game.genre.slice(0, 3).join(" · ")}
        </p>
        <div className="origin-left max-sm:scale-[0.85] max-sm:-mb-0.5">
          <Rating value={game.rating} count={game.reviewCount} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 sm:mt-1">
          <div className="min-w-0 origin-bottom-left max-sm:scale-[0.85]">
            <Price original={game.originalPrice} sale={game.salePrice} />
          </div>
          <span className="hidden items-center gap-1 text-xs font-medium text-accent-cyan opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
            Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
