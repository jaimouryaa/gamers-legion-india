"use client";

import { useState } from "react";
import { PackageX } from "lucide-react";
import { BundleCard } from "@/components/site/bundle-card";
import { BundleDetailsModal } from "@/components/site/bundle-details-modal";
import type { Bundle, Game } from "@/lib/types";

export function BundleBrowser({ bundles, games }: { bundles: Bundle[]; games: Game[] }) {
  const [active, setActive] = useState<Bundle | null>(null);

  if (bundles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-glass-strong py-20 text-center">
        <PackageX size={28} className="text-text-muted" />
        <p className="font-display text-lg font-medium text-text-primary">
          No bundles available right now.
        </p>
        <p className="max-w-sm text-sm text-text-muted">Check back soon for new collections.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {bundles.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} onOpen={setActive} />
        ))}
      </div>
      <BundleDetailsModal bundle={active} games={games} onClose={() => setActive(null)} />
    </>
  );
}
