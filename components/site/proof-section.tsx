import Link from "next/link";
import { ShieldCheck, Gamepad2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArcadeReveal } from "@/components/site/arcade-reveal";
import { CoverArt } from "@/components/ui/cover-art";
import type { Proof } from "@/lib/types";

export function ProofSection({ proofs }: { proofs: Proof[] }) {
  if (proofs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ArcadeReveal>
        <SectionHeading
          eyebrow="Verified & trusted"
          title="Real deliveries, real proof"
          subtitle="A look at recently completed orders — see it all, plus how your game gets activated."
          viewAllHref="/proof"
        />
      </ArcadeReveal>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {proofs.slice(0, 4).map((proof, i) => (
          <ArcadeReveal key={proof.id} delay={i * 0.08}>
          <div className="arcade-card glass-panel overflow-hidden rounded-2xl">
            <div className="relative aspect-video">
              <CoverArt title={proof.caption ?? "Delivery proof"} imageUrl={proof.imageUrl} fit="contain" />
            </div>
            {(proof.caption || proof.gameTitle) && (
              <div className="flex flex-col gap-1.5 p-3.5">
                {proof.caption && (
                  <p className="line-clamp-2 text-xs text-text-secondary">{proof.caption}</p>
                )}
                {proof.gameTitle && proof.gameSlug && (
                  <Link
                    href={`/games/${proof.gameSlug}`}
                    className="flex w-fit items-center gap-1 text-xs font-medium text-accent-cyan hover:underline"
                  >
                    <Gamepad2 size={11} />
                    {proof.gameTitle}
                  </Link>
                )}
              </div>
            )}
          </div>
          </ArcadeReveal>
        ))}
      </div>
      <ArcadeReveal>
      <Link
        href="/proof"
        className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent-cyan"
      >
        <ShieldCheck size={14} />
        See all proof & game activation
      </Link>
      </ArcadeReveal>
    </section>
  );
}
