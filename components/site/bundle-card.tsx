"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import type { Bundle } from "@/lib/types";

export function BundleCard({ bundle, onOpen }: { bundle: Bundle; onOpen: (bundle: Bundle) => void }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(bundle)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(bundle);
        }
      }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="arcade-card group glass-panel flex cursor-pointer flex-col overflow-hidden rounded-xl text-left transition-colors hover:border-accent-violet/40 sm:rounded-2xl sm:flex-row"
    >
      {/* Image */}
      <div className="relative aspect-video shrink-0 overflow-hidden bg-black/40 sm:aspect-auto sm:w-72 sm:min-h-[180px] md:w-80">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <CoverArt title={bundle.name} imageUrl={bundle.bannerImage} fit="contain" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
        {/* "X games" chip — smaller on mobile */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[11px]">
          <Layers size={9} className="sm:hidden" />
          <Layers size={12} className="hidden sm:block" />
          {bundle.gameIds.length} games
        </div>
        {bundle.discountPercentage > 0 && (
          <div className="absolute right-2 top-2 scale-75 origin-top-right sm:right-3 sm:top-3 sm:scale-100">
            <DiscountBadge percentage={bundle.discountPercentage} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-1.5 p-2 sm:gap-4 sm:p-5 md:p-6">
        <div>
          <h3 className="line-clamp-2 font-display text-[11px] font-semibold leading-tight text-text-primary sm:text-lg sm:leading-snug">{bundle.name}</h3>
          <p className="mt-1.5 hidden line-clamp-2 text-sm text-text-muted sm:block">{bundle.description}</p>
        </div>
        <div className="flex items-end justify-between gap-1 sm:gap-3">
          <div>
            {bundle.rating != null && (
              <div className="max-sm:scale-[0.8] max-sm:origin-left">
                <Rating value={bundle.rating} size="sm" />
              </div>
            )}
            <Price original={bundle.originalPrice} sale={bundle.bundlePrice} size="sm" className="mt-0.5 max-sm:origin-left max-sm:scale-90 sm:mt-1.5" />
          </div>
          <span className="hidden shrink-0 items-center gap-1 text-xs font-medium text-accent-violet opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
            View bundle <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
