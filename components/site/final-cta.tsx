import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArcadeReveal } from "@/components/site/arcade-reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-y border-border-glass">
      <div className="absolute inset-0 grid-atmosphere opacity-70" />
      <ArcadeReveal>
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Your next game is probably already here.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-text-secondary">
          Join thousands of gamers discovering great games and better deals.
        </p>
        <Link
          href="/games"
          className="arcade-cta group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary px-7 py-3.5 text-sm font-medium text-[#fdf1f3] shadow-[0_0_28px_-6px_rgba(53,224,238,0.6)] transition-transform hover:scale-[1.03]"
        >
          Explore catalog
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      </ArcadeReveal>
    </section>
  );
}
