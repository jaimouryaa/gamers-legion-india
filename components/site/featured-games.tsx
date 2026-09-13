import { SectionHeading } from "@/components/ui/section-heading";
import { GameGrid } from "@/components/site/game-grid";
import type { Game } from "@/lib/types";

export function FeaturedGames({ games }: { games: Game[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Handpicked"
        title="Featured games"
        subtitle="Top picks from our catalog, handpicked for you."
        viewAllHref="/games"
      />
      <div className="mt-8">
        <GameGrid games={games.slice(0, 8)} />
      </div>
    </section>
  );
}
