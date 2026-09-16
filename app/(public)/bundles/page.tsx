import type { Metadata } from "next";
import { getPublicBundles } from "@/lib/queries/bundles";
import { getPublicGames } from "@/lib/queries/games";
import { BundleBrowser } from "@/components/site/bundle-browser";

export const metadata: Metadata = {
  title: "Bundles",
  description: "Multi-game bundles at Gamers Legion India — more games, less money.",
};

export default async function BundlesPage() {
  const [bundles, games] = await Promise.all([getPublicBundles(), getPublicGames()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent-violet">BUNDLES</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Get more games. Save more.
        </h1>
        <p className="mt-2 max-w-xl text-text-secondary">
          {bundles.length} {bundles.length === 1 ? "bundle" : "bundles"} available right now.
        </p>
      </div>
      <BundleBrowser bundles={bundles} games={games} />
    </div>
  );
}
