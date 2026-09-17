import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, HelpCircle } from "lucide-react";
import { buildWhatsAppGeneralLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support",
  description: "Support and help for Gamers Legion India orders and accounts.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-cyan">SUPPORT</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Need a hand?
      </h1>
      <p className="mt-6 max-w-xl text-text-secondary leading-relaxed">
        Most questions — order status, key delivery, payment confirmation, trouble redeeming a
        game — are fastest to sort out over WhatsApp, since that&apos;s also how orders are
        placed and confirmed.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href={buildWhatsAppGeneralLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel flex flex-col gap-2 rounded-2xl p-5 transition-colors hover:border-accent-cyan/40"
        >
          <MessageCircle size={20} className="text-accent-cyan" />
          <h2 className="font-display text-sm font-semibold text-text-primary">
            Chat on WhatsApp
          </h2>
          <p className="text-sm text-text-muted">
            Order issues, delivery questions, or anything urgent.
          </p>
        </a>
        <Link
          href="/faq"
          className="glass-panel flex flex-col gap-2 rounded-2xl p-5 transition-colors hover:border-accent-cyan/40"
        >
          <HelpCircle size={20} className="text-accent-cyan" />
          <h2 className="font-display text-sm font-semibold text-text-primary">Read the FAQ</h2>
          <p className="text-sm text-text-muted">
            Common questions about buying, delivery, and refunds.
          </p>
        </Link>
      </div>
    </div>
  );
}
