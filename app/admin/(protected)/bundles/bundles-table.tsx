"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Archive, ArchiveRestore, Star, Trash2, Search } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { StatusPill } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { cn, formatINR } from "@/lib/utils";
import {
  setBundleStatus,
  toggleBundleFeatured,
  deleteBundlePermanently,
} from "@/app/admin/(protected)/bundles/actions";
import type { Bundle, GameStatus } from "@/lib/types";

const PAGE_SIZE = 8;

export function BundlesTable({ bundles }: { bundles: Bundle[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<GameStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const [confirmTarget, setConfirmTarget] = useState<{ bundle: Bundle; kind: "archive" | "delete" } | null>(null);

  const filtered = useMemo(() => {
    let list = bundles;
    if (status !== "all") list = list.filter((b) => b.status === status);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q));
    }
    return list;
  }, [bundles, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleToggleFeatured(bundle: Bundle) {
    startTransition(async () => {
      try {
        await toggleBundleFeatured(bundle.id, !bundle.featured);
        toast.success(bundle.featured ? "Removed from featured." : "Bundle featured.");
      } catch {
        toast.error("Couldn't update featured status.");
      }
    });
  }

  function handleArchiveToggle(bundle: Bundle) {
    const next: GameStatus = bundle.status === "archived" ? "draft" : "archived";
    startTransition(async () => {
      try {
        await setBundleStatus(bundle.id, next);
        toast.success(next === "archived" ? "Bundle archived successfully." : "Bundle restored to draft.");
      } catch {
        toast.error("Couldn't update this bundle.");
      } finally {
        setConfirmTarget(null);
      }
    });
  }

  function handleDelete(bundle: Bundle) {
    startTransition(async () => {
      try {
        await deleteBundlePermanently(bundle.id);
        toast.success("Bundle deleted.");
      } catch {
        toast.error("Couldn't delete this bundle.");
      } finally {
        setConfirmTarget(null);
      }
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full border border-border-glass-strong bg-surface px-3.5 py-2 sm:w-72">
          <Search size={15} className="text-text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as GameStatus | "all");
            setPage(1);
          }}
          className="h-10 rounded-full border border-border-glass-strong bg-surface px-3.5 text-sm text-text-secondary focus:border-accent-cyan/60 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border-glass">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-glass bg-surface/60 text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="px-4 py-3 font-medium">Bundle</th>
              <th className="px-4 py-3 font-medium">Games</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                  No bundles found.
                </td>
              </tr>
            )}
            {pageItems.map((bundle) => (
              <tr key={bundle.id} className="border-b border-border-glass last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                      <CoverArt title={bundle.name} imageUrl={bundle.bannerImage} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text-primary">{bundle.name}</p>
                      <p className="truncate text-xs text-text-muted">/{bundle.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{bundle.gameIds.length} games</td>
                <td className="px-4 py-3">
                  {bundle.discountPercentage > 0 ? (
                    <Price original={bundle.originalPrice} sale={bundle.bundlePrice} />
                  ) : (
                    bundle.bundlePrice ? formatINR(bundle.bundlePrice) : "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={bundle.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={pending}
                    onClick={() => handleToggleFeatured(bundle)}
                    aria-label={bundle.featured ? "Unfeature" : "Feature"}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                      bundle.featured ? "bg-warning/15 text-warning" : "text-text-muted hover:bg-white/5"
                    )}
                  >
                    <Star size={14} className={bundle.featured ? "fill-warning" : ""} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/bundles/${bundle.id}/edit`}
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-accent-cyan"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      aria-label={bundle.status === "archived" ? "Restore" : "Archive"}
                      onClick={() => setConfirmTarget({ bundle, kind: "archive" })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-warning"
                    >
                      {bundle.status === "archived" ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    </button>
                    <button
                      aria-label="Delete"
                      onClick={() => setConfirmTarget({ bundle, kind: "delete" })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-white/5 hover:text-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={cn(
                "h-8 w-8 rounded-full text-xs font-medium transition-colors",
                page === i + 1
                  ? "bg-accent-cyan/15 text-accent-cyan"
                  : "text-text-muted hover:bg-white/5 hover:text-text-primary"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title={
          confirmTarget?.kind === "delete"
            ? `Permanently delete "${confirmTarget.bundle.name}"?`
            : confirmTarget?.bundle.status === "archived"
              ? `Restore "${confirmTarget?.bundle.name}" to draft?`
              : `Archive "${confirmTarget?.bundle.name}"?`
        }
        description={
          confirmTarget?.kind === "delete"
            ? "This removes the bundle permanently. The individual games it referenced are not affected. This can't be undone."
            : confirmTarget?.bundle.status === "archived"
              ? "The bundle will go back to draft and stay hidden from the storefront until published again."
              : "Archived bundles are immediately hidden from the public storefront. You can restore them any time."
        }
        confirmLabel={confirmTarget?.kind === "delete" ? "Delete permanently" : "Confirm"}
        isDanger={confirmTarget?.kind === "delete" || confirmTarget?.bundle.status !== "archived"}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => {
          if (!confirmTarget) return;
          if (confirmTarget.kind === "delete") handleDelete(confirmTarget.bundle);
          else handleArchiveToggle(confirmTarget.bundle);
        }}
      />
    </div>
  );
}
