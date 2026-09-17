import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for Gamers Legion India.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent-cyan">LEGAL</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Refund Policy
      </h1>
      <p className="mt-3 text-sm text-text-muted">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
        <p>
          This is a general starting point and hasn&apos;t been reviewed by a lawyer — please
          have it checked and adapted to your actual policies (and any applicable consumer
          protection law) before relying on it.
        </p>
        <Section title="Digital goods">
          Because games and keys are delivered digitally and can&apos;t be &quot;returned&quot;
          once revealed or redeemed, we&apos;re generally unable to offer a refund after
          delivery.
        </Section>
        <Section title="When we will help">
          If a key doesn&apos;t work, was already used, or you received the wrong item, message
          us on WhatsApp with your order details as soon as possible — we&apos;ll look into it
          and offer a replacement or refund if the issue is on our end.
        </Section>
        <Section title="Before delivery">
          If you change your mind before a key has been sent, let us know right away and we&apos;ll
          cancel the order.
        </Section>
        <Section title="How refunds are issued">
          Approved refunds are returned using the same payment method used for the order, and
          arranged directly over WhatsApp.
        </Section>
        <Section title="Contact">
          For any order issue, reach out via the contact details in the footer.
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
