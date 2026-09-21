import type { Metadata } from "next";
import { getAllGamesForAdmin } from "@/lib/queries/games";
import { ProofForm } from "@/app/admin/(protected)/proofs/proof-form";
import { createProofAction } from "@/app/admin/(protected)/proofs/actions";

export const metadata: Metadata = { title: "Add Proof", robots: { index: false } };

export default async function NewProofPage() {
  const games = await getAllGamesForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        Add a delivery proof
      </h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Upload a screenshot showing a completed sale or delivery — this builds trust for new
        visitors.
      </p>
      <ProofForm games={games} action={createProofAction} />
    </div>
  );
}
