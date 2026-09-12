import Link from "next/link";
import { InstagramIcon, YoutubeIcon, XIcon, DiscordIcon } from "@/components/ui/social-icons";
import { FOOTER, SITE } from "@/lib/config";

const SOCIAL_ICONS: Record<string, typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
  X: XIcon,
  Discord: DiscordIcon,
};

export function Footer() {
  return (
    <footer className="border-t border-border-glass bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-primary to-accent-violet font-display text-sm font-bold text-[#fdf1f3]">
                GL
              </span>
              <span className="font-display leading-tight">
                <span className="block text-[13px] font-semibold tracking-[0.14em] text-text-primary">
                  GAMERS LEGION
                </span>
                <span className="block text-[10px] font-medium tracking-[0.3em] text-accent-primary">
                  INDIA
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-text-muted">{FOOTER.description}</p>
            <div className="mt-5 flex items-center gap-3">
              {FOOTER.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border-glass text-text-muted transition-colors hover:border-accent-primary/50 hover:text-accent-primary"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterColumn title="Navigate" links={FOOTER.navigation} />
          <FooterColumn title="Support" links={FOOTER.support} />
          <FooterColumn title="Legal" links={FOOTER.legal} />
        </div>

        <div className="mt-12 border-t border-border-glass pt-6 text-xs text-text-muted">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-text-secondary hover:text-text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
