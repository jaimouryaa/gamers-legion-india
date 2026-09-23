import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ArcadeReveal } from "@/components/site/arcade-reveal";
import { PROMOTION } from "@/lib/config";

export function PromotionBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ArcadeReveal>
      <div className="relative overflow-hidden rounded-3xl border border-border-glass bg-gradient-to-br from-surface via-surface-elevated to-surface p-10 sm:p-14">
        <div className="arcade-promo-orb pointer-events-none absolute -left-10 -top-16 h-64 w-64 rounded-full bg-accent-violet/25 blur-[100px]" />
        <div className="arcade-promo-orb pointer-events-none absolute -right-10 -bottom-16 h-64 w-64 rounded-full bg-accent-primary/25 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent-magenta">
              {PROMOTION.title}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
              {PROMOTION.subtitle}
            </h2>
            <p className="mt-3 max-w-md text-sm text-text-secondary sm:text-base">
              {PROMOTION.description}
            </p>
          </div>
          <Link
            href={PROMOTION.ctaHref}
            className="arcade-cta group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary px-6 py-3 text-sm font-medium text-[#fdf1f3] shadow-[0_0_24px_-6px_rgba(53,224,238,0.55)] transition-transform hover:scale-[1.03]"
          >
            {PROMOTION.ctaLabel}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      </ArcadeReveal>
    </section>
  );
}
