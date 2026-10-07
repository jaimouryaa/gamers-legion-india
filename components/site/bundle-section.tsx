"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { BundleCard } from "@/components/site/bundle-card";
import { BundleDetailsModal } from "@/components/site/bundle-details-modal";
import { ArcadeReveal } from "@/components/site/arcade-reveal";
import { FALLBACK_BUNDLES } from "@/lib/data/fallback-bundles";
import type { Bundle, Game } from "@/lib/types";

export function BundleSection({ bundles, games }: { bundles: Bundle[]; games: Game[] }) {
  const [active, setActive] = useState<Bundle | null>(null);

  // If bundles is empty, gracefully use fallback bundles so the section is always active.
  const displayList = bundles.length > 0 ? bundles : FALLBACK_BUNDLES;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ArcadeReveal>
        <SectionHeading
          eyebrow="Bundle deals"
          title="Featured game bundles"
          subtitle="Curated collections with stacked discounts. Get more games for less."
          viewAllHref="/bundles"
        />
      </ArcadeReveal>
      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-1 sm:gap-5 lg:grid-cols-2">
        {displayList.slice(0, 4).map((bundle, i) => (
          <ArcadeReveal key={bundle.id} delay={i * 0.08}>
            <BundleCard bundle={bundle} onOpen={setActive} />
          </ArcadeReveal>
        ))}
      </div>
      <BundleDetailsModal bundle={active} games={games} onClose={() => setActive(null)} />
    </section>
  );
}
