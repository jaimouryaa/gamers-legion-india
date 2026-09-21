import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Gamepad2 } from "lucide-react";
import { getPublishedProofs } from "@/lib/queries/proofs";
import { CoverArt } from "@/components/ui/cover-art";
import { ActivationGuide } from "@/components/site/activation-guide";

export const metadata: Metadata = {
  title: "Proof & Activation Guide",
  description:
    "See real completed deliveries from Gamers Legion India, and find step-by-step instructions for activating your game.",
};

export default async function ProofPage() {
  const proofs = await getPublishedProofs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-accent-cyan">
          <ShieldCheck size={13} />
          VERIFIED & TRUSTED
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Real deliveries. Real proof.
        </h1>
        <p className="mt-2 max-w-xl text-text-secondary">
          A look at completed orders, plus step-by-step instructions for activating whatever you
          buy.
        </p>
      </div>

      <section>
        <h2 className="mb-5 font-display text-lg font-semibold text-text-primary">
          Recent deliveries
        </h2>
        {proofs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-glass-strong py-16 text-center">
            <p className="font-display text-base font-medium text-text-primary">
              No proof posted yet
            </p>
            <p className="max-w-sm text-sm text-text-muted">
              Check back soon — completed orders are posted here regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proofs.map((proof) => (
              <div key={proof.id} className="glass-panel overflow-hidden rounded-2xl">
                <div className="relative aspect-video">
                  <CoverArt title={proof.caption ?? "Delivery proof"} imageUrl={proof.imageUrl} fit="contain" />
                </div>
                {(proof.caption || proof.gameTitle) && (
                  <div className="flex flex-col gap-1.5 p-4">
                    {proof.caption && (
                      <p className="text-sm text-text-secondary">{proof.caption}</p>
                    )}
                    {proof.gameTitle && proof.gameSlug && (
                      <Link
                        href={`/games/${proof.gameSlug}`}
                        className="flex w-fit items-center gap-1.5 text-xs font-medium text-accent-cyan hover:underline"
                      >
                        <Gamepad2 size={12} />
                        {proof.gameTitle}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="mb-2 font-display text-lg font-semibold text-text-primary">
          How to activate your game
        </h2>
        <p className="mb-5 text-sm text-text-muted">
          Pick your platform below for step-by-step redemption instructions.
        </p>
        <ActivationGuide />
      </section>
    </div>
  );
}
