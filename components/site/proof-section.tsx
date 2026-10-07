"use client";

import Link from "next/link";
import { ShieldCheck, Gamepad2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArcadeReveal } from "@/components/site/arcade-reveal";
import { CoverArt } from "@/components/ui/cover-art";
import type { Proof } from "@/lib/types";

/** One proof card — portrait 9:16 ratio like a phone screenshot */
function ProofCard({ proof }: { proof: Proof }) {
  return (
    <div className="arcade-card glass-panel flex w-36 shrink-0 flex-col overflow-hidden rounded-xl sm:w-44 lg:w-52">
      {/* 9:16 portrait image */}
      <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
        <CoverArt
          title={proof.caption ?? "Delivery proof"}
          imageUrl={proof.imageUrl}
          fit="contain"
        />
      </div>

      {/* Caption / game link */}
      {(proof.caption || proof.gameTitle) && (
        <div className="flex flex-col gap-1 p-2 sm:p-2.5">
          {proof.caption && (
            <p className="line-clamp-2 text-[10px] leading-snug text-text-secondary sm:text-[11px]">
              {proof.caption}
            </p>
          )}
          {proof.gameTitle && proof.gameSlug && (
            <Link
              href={`/games/${proof.gameSlug}`}
              className="flex w-fit items-center gap-1 text-[10px] font-medium text-accent-cyan hover:underline sm:text-[11px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Gamepad2 size={10} />
              <span className="truncate">{proof.gameTitle}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function ProofSection({ proofs }: { proofs: Proof[] }) {
  if (proofs.length === 0) return null;

  // Need at least a reasonable belt — pad up to 8 cards by cycling
  const MIN = 8;
  const padded: Proof[] = [];
  while (padded.length < MIN) {
    for (const p of proofs) {
      padded.push(p);
      if (padded.length >= MIN) break;
    }
  }

  // Duplicate the set so the marquee loops seamlessly
  const belt = [...padded, ...padded];

  // Animation duration: slower for fewer cards, faster for many
  const durationSec = Math.max(18, padded.length * 3.5);

  return (
    <section className="py-16">
      {/* Heading — constrained width */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ArcadeReveal>
          <SectionHeading
            eyebrow="Verified & trusted"
            title="Real deliveries, real proof"
            subtitle="A look at recently completed orders — see it all, plus how your game gets activated."
            viewAllHref="/proof"
          />
        </ArcadeReveal>
      </div>

      {/* Marquee belt — full-width, overflows intentionally */}
      <div className="relative mt-8 overflow-hidden">
        {/* Left fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-24"
          style={{
            background: "linear-gradient(to right, var(--void) 0%, transparent 100%)",
          }}
        />
        {/* Right fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-24"
          style={{
            background: "linear-gradient(to left, var(--void) 0%, transparent 100%)",
          }}
        />

        {/* Scrolling belt */}
        <div
          className="flex gap-3 sm:gap-4"
          style={{
            width: "max-content",
            animation: `proof-marquee ${durationSec}s linear infinite`,
            animationPlayState: "running",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
          }}
        >
          {belt.map((proof, i) => (
            <ProofCard key={`${proof.id}-${i}`} proof={proof} />
          ))}
        </div>
      </div>

      {/* "See all" link */}
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ArcadeReveal>
          <Link
            href="/proof"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent-cyan"
          >
            <ShieldCheck size={14} />
            See all proof &amp; game activation
          </Link>
        </ArcadeReveal>
      </div>
    </section>
  );
}
