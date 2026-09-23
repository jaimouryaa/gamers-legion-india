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
      className="arcade-card group glass-panel flex cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-colors hover:border-accent-violet/40 sm:flex-row"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-72">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <CoverArt title={bundle.name} imageUrl={bundle.bannerImage} fit="contain" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <Layers size={12} />
          {bundle.gameIds.length} games
        </div>
        {bundle.discountPercentage > 0 && (
          <div className="absolute right-3 top-3">
            <DiscountBadge percentage={bundle.discountPercentage} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">{bundle.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{bundle.description}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            {bundle.rating != null && <Rating value={bundle.rating} size="sm" />}
            <Price original={bundle.originalPrice} sale={bundle.bundlePrice} size="md" className="mt-1.5" />
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent-violet opacity-0 transition-opacity group-hover:opacity-100">
            View bundle <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
