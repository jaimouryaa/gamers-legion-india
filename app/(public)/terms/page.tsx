import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Gamers Legion India.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-cyan">LEGAL</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-text-muted">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
        <p>
          These terms are a general starting point and haven&apos;t been reviewed by a lawyer —
          please have them checked and adapted to your specific business practices before relying
          on them.
        </p>
        <Section title="1. Using this site">
          By browsing or placing an order through Gamers Legion India, you agree to these terms.
          If you don&apos;t agree, please don&apos;t use the site.
        </Section>
        <Section title="2. Orders and payment">
          Listings on this site describe digital games, keys, or accounts available for purchase.
          Orders are confirmed and paid for directly over WhatsApp — placing an item in your cart
          does not itself constitute a confirmed order. All prices are listed in Indian Rupees
          (₹) and may change without notice.
        </Section>
        <Section title="3. Digital delivery">
          Products are delivered digitally (a key, code, or account details) after payment is
          confirmed. Delivery times can vary by title and order volume.
        </Section>
        <Section title="4. Accuracy of listings">
          We aim to keep prices, discounts, and availability accurate, but errors can happen. If
          a listing is mispriced or unavailable after you order, we&apos;ll let you know and offer
          a refund or alternative.
        </Section>
        <Section title="5. Acceptable use">
          Don&apos;t use this site for any unlawful purpose, or attempt to interfere with its
          normal operation.
        </Section>
        <Section title="6. Changes">
          We may update these terms from time to time; continued use of the site after a change
          means you accept the updated terms.
        </Section>
        <Section title="7. Contact">
          Questions about these terms can be sent to us via the contact details in the footer.
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
