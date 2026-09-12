import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Gamers Legion India.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-primary">ABOUT US</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Built for India&apos;s gaming community.
      </h1>
      <p className="mt-6 text-text-secondary leading-relaxed">
        Gamers Legion India is a marketplace for discovering games, deals and bundles — priced
        in rupees, curated for local gamers, and built to feel as good to browse as your
        favourite games feel to play. We work directly with a small, focused catalog so every
        listing on the site is one our team has actually vetted.
      </p>
      <p className="mt-4 text-text-secondary leading-relaxed">
        Have a question, a game request, or found a bug? Reach out any time from the WhatsApp
        link on a listing, or through our socials in the footer.
      </p>
    </div>
  );
}
