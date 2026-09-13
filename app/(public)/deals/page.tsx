import type { Metadata } from "next";
import { getPublicGames } from "@/lib/queries/games";
import { GameGrid } from "@/components/site/game-grid";

export const metadata: Metadata = {
  title: "Deals",
  description: "All active limited-time deals at Gamers Legion India.",
};

export default async function DealsPage() {
  const games = await getPublicGames();
  const deals = games
    .filter((g) => g.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent-magenta">SAVE MORE</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Today&apos;s deals
        </h1>
        <p className="mt-2 max-w-xl text-text-secondary">
          {deals.length} active {deals.length === 1 ? "deal" : "deals"} across the catalog.
        </p>
      </div>
      <GameGrid games={deals} />
    </div>
  );
}
