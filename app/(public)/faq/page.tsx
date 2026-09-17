import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Gamers Legion India.",
};

const FAQS = [
  {
    q: "How do I buy a game?",
    a: "Add a game to your cart (or buy it directly from its details page), then checkout on WhatsApp. This sends a pre-filled message with the game and price so we can confirm your order and payment directly.",
  },
  {
    q: "How is the game delivered?",
    a: "Once payment is confirmed over WhatsApp, we send your game key or account details there. Delivery is typically quick, but can vary by title.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Payment is arranged directly over WhatsApp once your order is confirmed — we'll share the available options in that chat.",
  },
  {
    q: "Can I get a refund?",
    a: "See our Refund Policy for details — in short, digital keys generally can't be refunded once delivered, but reach out on WhatsApp if something's gone wrong and we'll take a look.",
  },
  {
    q: "Do you sell physical copies?",
    a: "No — everything on Gamers Legion India is a digital key or account, delivered electronically.",
  },
  {
    q: "How do I know a listing is legitimate?",
    a: "Every game on the catalog is added and reviewed by our team directly — we don't allow third-party or unverified listings.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-cyan">FAQ</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Frequently asked questions.
      </h1>

      <div className="mt-10 flex flex-col divide-y divide-border-glass">
        {FAQS.map((item) => (
          <div key={item.q} className="py-6">
            <h2 className="font-display text-base font-semibold text-text-primary">{item.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
