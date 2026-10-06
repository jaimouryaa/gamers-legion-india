"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { GameWheel, type GameWheelHandle, type GameWheelItem } from "@/components/ui/game-wheel";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

const pad = (n: number) => String(n).padStart(2, "0");

export function GameHero({ games }: { games: Game[] }) {
  const wheel = useRef<GameWheelHandle>(null);
  const [active, setActive] = useState(0);

  // Covers link to the existing /games/[slug] page for each game.
  const items = useMemo<GameWheelItem[]>(
    () =>
      games.map((g) => ({
        id: g.id,
        title: g.title,
        image: g.coverImage,
        href: `/games/${g.slug}`,
        genre: g.genre,
      })),
    [games],
  );
  const game = games[active] ?? games[0];

  return (
    <section
      aria-label="Featured games"
      className="relative overflow-hidden border-b border-border-glass bg-void"
    >
      {/* Very soft burgundy glow behind the wheel */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/10 blur-[120px] lg:left-auto lg:right-[8%] lg:top-1/2"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-x-10 gap-y-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[1fr_auto_auto] lg:px-8 lg:py-12">
        {/* Copy */}
        <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-accent-primary">
            {SITE.name.toUpperCase()}
          </p>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-tight text-text-primary">
            <span className="block">DISCOVER</span>
            <span className="block">YOUR NEXT</span>
            <span className="block">
              GAME<span className="text-accent-primary">.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-md text-base text-text-secondary sm:text-lg">
            Explore games across every genre, platform and world.
          </p>
        </div>

        {/* Wheel */}
        <div className="relative order-2 h-[52svh] min-h-[340px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:h-[min(80svh,760px)] lg:self-center">
          <GameWheel ref={wheel} items={items} onActiveChange={setActive} className="h-full w-full" />

          {/* Index: outside the covers, desktop only */}
          <ol className="absolute right-1 top-1/2 hidden -translate-y-1/2 flex-col gap-1.5 xl:flex">
            {games.map((g, i) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => wheel.current?.goTo(i)}
                  aria-current={i === active}
                  className={cn(
                    "flex max-w-[9.5rem] items-center gap-2 truncate text-left text-[11px] tracking-wide transition-colors",
                    i === active ? "font-semibold text-accent-primary" : "text-text-muted hover:text-text-secondary",
                  )}
                >
                  <span className="tabular-nums">{pad(i + 1)}</span>
                  <span className="truncate uppercase">{g.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Active game info: always outside the cover */}
        <div className="order-3 lg:col-start-1 lg:row-start-3" aria-live="polite">
          <p className="mb-2 text-xs tabular-nums tracking-[0.2em] text-text-muted lg:hidden">
            {pad(active + 1)} / {pad(games.length)}
          </p>
          {game && (
            <div className="flex flex-col gap-1">
              <p className="font-display text-xl font-semibold text-text-primary">{game.title}</p>
              <p className="text-sm text-text-muted">
                {[...game.genre.slice(0, 2), ...game.platforms.slice(0, 2)].join(" · ")}
              </p>
              <div className="mt-1 flex items-center gap-4">
                <Price original={game.originalPrice} sale={game.salePrice} />
                <Link
                  href={`/games/${game.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-primary hover:underline"
                >
                  View game <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="order-4 flex flex-wrap items-center gap-3 lg:col-start-1 lg:row-start-2 lg:self-start">
          <LinkButton href="/games" size="lg" className="arcade-cta">
            Explore Games
            <ArrowRight size={18} />
          </LinkButton>
          <LinkButton href="/deals" variant="secondary" size="lg">
            View Deals
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export default GameHero;
