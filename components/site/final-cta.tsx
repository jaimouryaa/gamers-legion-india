import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArcadeReveal } from "@/components/site/arcade-reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-y border-border-glass">
      <div className="absolute inset-0 grid-atmosphere opacity-70" />
      <ArcadeReveal>
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-display text-2xl font-bold text-text-primary sm:text-4xl">
          Your next game is probably already here.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary sm:mt-4 sm:text-base">
          Join thousands of gamers discovering great games and better deals.
        </p>
        <Link
          href="/games"
          className="arcade-cta group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary px-6 py-3 text-sm font-medium text-[#fdf1f3] shadow-[0_0_28px_-6px_rgba(53,224,238,0.6)] transition-transform hover:scale-[1.03] sm:mt-8 sm:px-7 sm:py-3.5"
        >
          Explore catalog
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      </ArcadeReveal>
    </section>
  );
}
