import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, YoutubeIcon, XIcon, DiscordIcon } from "@/components/ui/social-icons";
import { buildWhatsAppGeneralLink } from "@/lib/utils";
import { FOOTER } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Gamers Legion India.",
};

const SOCIAL_ICONS: Record<string, typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
  X: XIcon,
  Discord: DiscordIcon,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-cyan">CONTACT US</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Get in touch.
      </h1>
      <p className="mt-6 max-w-xl text-text-secondary leading-relaxed">
        The fastest way to reach us is WhatsApp — for order questions, game requests, or
        anything else. We usually reply within a few hours.
      </p>

      <a
        href={buildWhatsAppGeneralLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue px-6 py-3 text-sm font-medium text-[#fdf1f3] shadow-[0_0_24px_-6px_rgba(212,51,95,0.55)] transition-transform hover:scale-[1.03]"
      >
        <MessageCircle size={16} />
        Message us on WhatsApp
      </a>

      <div className="mt-12 border-t border-border-glass pt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          Follow us
        </h2>
        <div className="mt-4 flex items-center gap-3">
          {FOOTER.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.label];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-glass text-text-muted transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
              >
                <Icon size={17} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
