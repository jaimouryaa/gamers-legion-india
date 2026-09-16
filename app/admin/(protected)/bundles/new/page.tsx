import type { Metadata } from "next";
import { getAllGamesForAdmin } from "@/lib/queries/games";
import { BundleForm } from "@/app/admin/(protected)/bundles/bundle-form";
import { createBundleAction } from "@/app/admin/(protected)/bundles/actions";

export const metadata: Metadata = { title: "Create Bundle", robots: { index: false } };

export default async function NewBundlePage() {
  const games = await getAllGamesForAdmin();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Create a bundle</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Discount % and savings are calculated automatically from the prices you enter.
      </p>
      <BundleForm games={games} action={createBundleAction} />
    </div>
  );
}
