"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff, Gamepad2 } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { cn } from "@/lib/utils";
import { togglePublished, deleteProof } from "@/app/admin/(protected)/proofs/actions";
import type { Proof } from "@/lib/types";

export function ProofsGallery({ proofs }: { proofs: Proof[] }) {
  const [pending, startTransition] = useTransition();
  const [confirmTarget, setConfirmTarget] = useState<Proof | null>(null);

  function handleToggle(proof: Proof) {
    startTransition(async () => {
      try {
        await togglePublished(proof.id, !proof.published);
        toast.success(proof.published ? "Hidden from the public page." : "Now published.");
      } catch {
        toast.error("Couldn't update this proof.");
      }
    });
  }

  function handleDelete(proof: Proof) {
    startTransition(async () => {
      try {
        await deleteProof(proof.id);
        toast.success("Proof deleted.");
      } catch {
        toast.error("Couldn't delete this proof.");
      } finally {
        setConfirmTarget(null);
      }
    });
  }

  if (proofs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-glass-strong py-20 text-center">
        <p className="font-display text-lg font-medium text-text-primary">No proofs yet</p>
        <p className="max-w-sm text-sm text-text-muted">
          Add your first screenshot to start building the public trust gallery.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {proofs.map((proof) => (
          <div key={proof.id} className="glass-panel overflow-hidden rounded-2xl">
            <div className="relative aspect-video">
              <CoverArt title={proof.caption ?? "Proof"} imageUrl={proof.imageUrl} fit="contain" />
              <span
                className={cn(
                  "absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium",
                  proof.published ? "bg-success/20 text-success" : "bg-black/50 text-text-muted"
                )}
              >
                {proof.published ? <Eye size={11} /> : <EyeOff size={11} />}
                {proof.published ? "Published" : "Hidden"}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4">
              {proof.caption && <p className="text-sm text-text-secondary">{proof.caption}</p>}
              {proof.gameTitle && proof.gameSlug && (
                <Link
                  href={`/games/${proof.gameSlug}`}
                  target="_blank"
                  className="flex w-fit items-center gap-1.5 text-xs font-medium text-accent-cyan hover:underline"
                >
                  <Gamepad2 size={12} />
                  {proof.gameTitle}
                </Link>
              )}
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {new Date(proof.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={pending}
                    onClick={() => handleToggle(proof)}
                    aria-label={proof.published ? "Hide" : "Publish"}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-accent-cyan"
                  >
                    {proof.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    disabled={pending}
                    onClick={() => setConfirmTarget(proof)}
                    aria-label="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this proof?"
        description="This removes it from the public page permanently. This can't be undone."
        confirmLabel="Delete permanently"
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => confirmTarget && handleDelete(confirmTarget)}
      />
    </>
  );
}
