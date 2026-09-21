import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProofsForAdmin } from "@/lib/queries/proofs";
import { ProofsGallery } from "@/app/admin/(protected)/proofs/proofs-gallery";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Proof of Delivery", robots: { index: false } };

export default async function AdminProofsPage() {
  const proofs = await getAllProofsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-primary">
            Proof of delivery
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {proofs.length} {proofs.length === 1 ? "screenshot" : "screenshots"} — shown publicly on /proof.
          </p>
        </div>
        <Link href="/admin/proofs/new">
          <Button>
            <Plus size={16} />
            Add proof
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <ProofsGallery proofs={proofs} />
      </div>
    </div>
  );
}
