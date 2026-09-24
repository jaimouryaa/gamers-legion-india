import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Gamers Legion India.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-cyan">LEGAL</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-text-muted">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
        <p>
          This is a general starting point and hasn&apos;t been reviewed by a lawyer — please
          have it checked and adapted (including for any applicable data protection law) before
          relying on it.
        </p>
        <Section title="What we collect">
          Browsing this site doesn&apos;t require an account. Your cart and wishlist are stored
          only in your own browser (not on our servers) and are cleared if you clear your browser
          data. When you place an order via WhatsApp, we receive whatever information you choose
          to share in that conversation (e.g. your name and contact details), through WhatsApp
          itself.
        </Section>
        <Section title="Admin data">
          Administrator accounts (used to manage the game catalog) are stored securely via our
          database provider, Supabase, with access restricted to authorized staff.
        </Section>
        <Section title="Cookies">
          We use a small amount of local browser storage to remember your cart and wishlist.
          The site follows your device&apos;s appearance setting. We don&apos;t use tracking or advertising cookies.
        </Section>
        <Section title="Third parties">
          Orders are confirmed over WhatsApp, a service operated by Meta — its own privacy policy
          applies to conversations there.
        </Section>
        <Section title="Contact">
          Questions about this policy can be sent to us via the contact details in the footer.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 font-display text-base font-semibold text-text-primary">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
