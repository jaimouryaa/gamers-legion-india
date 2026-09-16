import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBundleByIdForAdmin } from "@/lib/queries/bundles";
import { getAllGamesForAdmin } from "@/lib/queries/games";
import { BundleForm } from "@/app/admin/(protected)/bundles/bundle-form";
import { updateBundleAction } from "@/app/admin/(protected)/bundles/actions";

export const metadata: Metadata = { title: "Edit Bundle", robots: { index: false } };

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [bundle, games] = await Promise.all([getBundleByIdForAdmin(id), getAllGamesForAdmin()]);
  if (!bundle) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Edit {bundle.name}</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Discount % and savings update automatically when you change prices.
      </p>
      <BundleForm bundle={bundle} games={games} action={updateBundleAction.bind(null, id)} />
    </div>
  );
}
