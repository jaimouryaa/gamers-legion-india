import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublicGames } from "@/lib/queries/games";
import { CatalogExplorer } from "@/components/site/catalog-explorer";
import { GameGridSkeleton } from "@/components/site/game-grid";

export const metadata: Metadata = {
  title: "Browse Games",
  description: "Browse the full Gamers Legion India catalog — search, filter and sort by genre, price and rating.",
};

export default async function GamesPage() {
  const games = await getPublicGames();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent-primary">CATALOG</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Browse games
        </h1>
        <p className="mt-2 max-w-xl text-text-secondary">
          Search, filter and sort the full catalog to find your next game.
        </p>
      </div>
      <Suspense fallback={<GameGridSkeleton />}>
        <CatalogExplorer games={games} />
      </Suspense>
    </div>
  );
}
