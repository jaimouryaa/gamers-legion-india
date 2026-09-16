import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllBundlesForAdmin } from "@/lib/queries/bundles";
import { BundlesTable } from "@/app/admin/(protected)/bundles/bundles-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Manage Bundles", robots: { index: false } };

export default async function AdminBundlesPage() {
  const bundles = await getAllBundlesForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-primary">Bundles</h1>
          <p className="mt-1 text-sm text-text-muted">{bundles.length} total bundles.</p>
        </div>
        <Link href="/admin/bundles/new">
          <Button>
            <Plus size={16} />
            Create bundle
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <BundlesTable bundles={bundles} />
      </div>
    </div>
  );
}
