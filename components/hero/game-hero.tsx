"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { EarthBlaze } from "@/components/ui/earth-blaze";
import { GameWheel, type GameWheelHandle, type GameWheelItem } from "@/components/ui/game-wheel";
import { SITE } from "@/lib/config";
import type { Game } from "@/lib/types";

export function GameHero({ games }: { games: Game[] }) {
  const wheel = useRef<GameWheelHandle>(null);

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

  return (
    <section
      aria-label="Featured games"
      className="relative min-h-svh overflow-hidden border-b border-border-glass"
    >
      {/* ── EarthBlaze full-screen background ── */}
      <EarthBlaze
        interactive
        auroraEnabled
        starCount={1800}
        illumination={1.1}
        surfaceBrightness={1.2}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          aspectRatio: "auto",
          zIndex: 0,
        }}
      />

      {/* Left-to-right gradient — keeps copy readable without hiding the Earth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.60) 42%, rgba(0,0,0,0.12) 72%, transparent 100%)",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-32"
        style={{
          background: "linear-gradient(to top, var(--void, #000) 0%, transparent 100%)",
        }}
      />

      {/* GL logo watermark — screen blend so only the red glow bleeds through the Earth */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-[2]"
        style={{
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "min(44vw, 500px)",
          height: "min(44vw, 500px)",
          opacity: 0.11,
          mixBlendMode: "screen",
        }}
      >
        <Image
          src="/gl-logo.webp"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-[3] mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* ── Left column: copy + CTAs ── */}
          <div className="flex flex-col items-start justify-center py-16 lg:py-24">

            {/* Logo + brand name */}
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/gl-logo.webp"
                alt="Gamers Legion India logo"
                width={44}
                height={44}
                className="h-10 w-10 object-contain drop-shadow-lg"
                priority
              />
              <span className="text-sm font-bold tracking-[0.28em] uppercase text-white/80">
                {SITE.name}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[clamp(3.25rem,9vw,6.5rem)] font-bold leading-[0.93] tracking-tight text-white">
              <span className="block">JOIN THE</span>
              <span className="block text-accent-primary">LEGION.</span>
            </h1>

            {/* Sub-copy */}
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/70 sm:text-xl">
              Explore games across every genre, platform and world.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LinkButton href="/games" size="lg" className="arcade-cta">
                Explore Games
                <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/deals" variant="secondary" size="lg">
                View Deals
              </LinkButton>
            </div>

          </div>

          {/* ── Right column: Game Wheel only, no list ── */}
          <div className="flex h-[55svh] items-center justify-center lg:h-[min(78svh,740px)]">
            <GameWheel
              ref={wheel}
              items={items}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameHero;
