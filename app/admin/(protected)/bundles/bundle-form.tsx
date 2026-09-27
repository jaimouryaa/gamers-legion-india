"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { CoverArt } from "@/components/ui/cover-art";
import { calcDiscount, formatINR } from "@/lib/utils";
import type { Bundle, Game } from "@/lib/types";
import type { FormState } from "@/app/admin/(protected)/bundles/actions";

export function BundleForm({
  bundle,
  games,
  action,
}: {
  bundle?: Bundle;
  games: Game[];
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [selectedIds, setSelectedIds] = useState<string[]>(bundle?.gameIds ?? []);
  const [query, setQuery] = useState("");

  // ─── Auto-computed originalPrice ───────────────────────────────────────────
  // Sum the salePrice of every selected game. This is recalculated every time
  // the game selection changes so the admin never has to type it manually.
  const computedOriginalPrice = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const game = games.find((g) => g.id === id);
      return sum + (game?.salePrice ?? 0);
    }, 0);
  }, [selectedIds, games]);

  // bundlePrice is fully editable — it is the discounted price the admin sets.
  // Seed from the existing bundle on edit; default to the auto-computed sum on
  // "new bundle" so there is always a sensible starting value in the field.
  const [bundlePrice, setBundlePrice] = useState(
    bundle?.bundlePrice ?? computedOriginalPrice
  );

  // Keep bundlePrice in sync when the game selection changes — but only when
  // creating a new bundle. For an existing bundle we do not want to clobber
  // the saved price each time the admin tweaks the game list.
  const isNew = !bundle;
  const prevComputedRef = useRef(computedOriginalPrice);
  useEffect(() => {
    if (isNew && prevComputedRef.current !== computedOriginalPrice) {
      prevComputedRef.current = computedOriginalPrice;
      setBundlePrice(computedOriginalPrice);
    }
  }, [isNew, computedOriginalPrice]);

  const { savings, discountPercentage } = useMemo(
    () => calcDiscount(computedOriginalPrice, Number(bundlePrice) || 0),
    [computedOriginalPrice, bundlePrice]
  );

  const filteredGames = useMemo(() => {
    if (!query.trim()) return games;
    const q = query.trim().toLowerCase();
    return games.filter((g) => g.title.toLowerCase().includes(q));
  }, [games, query]);

  const fieldErrors = state?.fieldErrors ?? {};

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending) {
      if (!state?.error) {
        toast.success(bundle ? "Bundle updated successfully." : "Bundle created successfully.");
        router.push("/admin/bundles");
        router.refresh();
      }
    }
    wasPending.current = pending;
  }, [pending, state, bundle, router]);

  function toggleGame(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Selected games enriched with their Game objects for the breakdown table.
  const selectedGames = useMemo(
    () => selectedIds.map((id) => games.find((g) => g.id === id)).filter(Boolean) as Game[],
    [selectedIds, games]
  );

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Hidden field carries the auto-computed originalPrice to the server */}
      <input type="hidden" name="originalPrice" value={computedOriginalPrice} />

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {state.error}
        </div>
      )}

      <Section title="Basic information">
        <Field label="Bundle name" error={fieldErrors.name}>
          <input name="name" defaultValue={bundle?.name} required className="input" />
        </Field>
        <Field label="Description" error={fieldErrors.description}>
          <textarea name="description" defaultValue={bundle?.description} required rows={3} className="input resize-none" />
        </Field>
        <MediaUploadField
          name="bannerImage"
          label="Bundle banner"
          hint="Optional — placeholder art used if empty"
          kind="banners"
          defaultValue={bundle?.bannerImage}
        />
      </Section>

      <Section title="Games in this bundle">
        {/* Selected games chip strip */}
        {selectedGames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGames.map((g) => (
              <span
                key={g.id}
                className="flex items-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 py-1 pl-1 pr-2.5 text-xs text-accent-cyan"
              >
                <span className="h-5 w-5 overflow-hidden rounded-full">
                  <CoverArt title={g.title} genre={g.genre} imageUrl={g.coverImage} fit="contain" />
                </span>
                {g.title}
                <button
                  type="button"
                  onClick={() => toggleGame(g.id)}
                  aria-label={`Remove ${g.title}`}
                  className="ml-0.5 opacity-60 hover:opacity-100"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-full border border-border-glass-strong bg-surface px-3.5 py-2">
          <Search size={15} className="text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games to add..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-border-glass">
          {filteredGames.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-text-muted">No games found.</p>
          ) : (
            <ul>
              {filteredGames.map((g) => {
                const checked = selectedIds.includes(g.id);
                return (
                  <li key={g.id} className="border-b border-border-glass last:border-0">
                    <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-white/[0.03]">
                      <input
                        type="checkbox"
                        name="gameIds"
                        value={g.id}
                        checked={checked}
                        onChange={() => toggleGame(g.id)}
                        className="h-4 w-4 accent-accent-cyan"
                      />
                      <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                        <CoverArt title={g.title} genre={g.genre} imageUrl={g.coverImage} fit="contain" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-text-primary">{g.title}</span>
                      <span className="shrink-0 text-xs text-text-muted">{formatINR(g.salePrice)}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {fieldErrors.gameIds && <span className="text-xs text-danger">{fieldErrors.gameIds}</span>}
        <p className="text-xs text-text-muted">{selectedIds.length} game(s) selected — pick at least 2.</p>
      </Section>

      <Section title="Pricing">
        {/* ── Auto-computed original price breakdown ──────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-border-glass bg-surface/60">
          <div className="border-b border-border-glass bg-white/[0.02] px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Included games — original price auto-calculated
            </p>
          </div>
          {selectedGames.length === 0 ? (
            <p className="px-4 py-4 text-sm text-text-muted">No games selected yet.</p>
          ) : (
            <ul>
              {selectedGames.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between gap-3 border-b border-border-glass px-4 py-2.5 last:border-0"
                >
                  <span className="truncate text-sm text-text-secondary">{g.title}</span>
                  <span className="shrink-0 text-sm font-medium text-text-primary">
                    {formatINR(g.salePrice)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between border-t border-border-glass-strong bg-white/[0.03] px-4 py-3">
            <span className="text-sm font-semibold text-text-secondary">Total (original price)</span>
            <span className="text-base font-bold text-accent-cyan">
              {formatINR(computedOriginalPrice)}
            </span>
          </div>
        </div>

        {/* ── Editable bundle price + read-only original price ────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Original price (₹)" hint="Auto-calculated from selected games">
            {/* Display-only — the real value is sent via the hidden input above */}
            <div className="input flex cursor-not-allowed select-none items-center gap-2 opacity-70">
              <span className="text-text-primary">{formatINR(computedOriginalPrice)}</span>
              <span className="ml-auto text-xs text-text-muted">auto</span>
            </div>
          </Field>

          <Field label="Bundle price (₹)" error={fieldErrors.bundlePrice} hint="The discounted price you offer">
            <input
              name="bundlePrice"
              type="number"
              min={0}
              step="1"
              value={bundlePrice}
              onChange={(e) => setBundlePrice(Number(e.target.value))}
              required
              className="input"
            />
          </Field>
        </div>

        {/* ── Live discount preview ────────────────────────────────────────── */}
        <div className="flex items-center gap-6 rounded-xl border border-border-glass bg-surface/60 px-4 py-3 text-sm">
          <span className="text-text-muted">
            Discount:{" "}
            <span className="font-semibold text-accent-cyan">{discountPercentage}% OFF</span>
          </span>
          <span className="text-text-muted">
            Savings:{" "}
            <span className="font-semibold text-success">{formatINR(savings)}</span>
          </span>
        </div>
      </Section>

      <Section title="Visibility">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Rating (0–5)">
            <input name="rating" type="number" min={0} max={5} step="0.1" defaultValue={bundle?.rating ?? ""} className="input" />
          </Field>
          <Field label="Expires" hint="Leave empty for no expiry">
            <input
              name="expiresAt"
              type="datetime-local"
              defaultValue={bundle?.expiresAt ? bundle.expiresAt.slice(0, 16) : ""}
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status" hint={!bundle ? "New bundles are Active by default." : undefined}>
            <select name="status" defaultValue={bundle?.status ?? "active"} className="input">
              <option value="active">Active</option>
              <option value="draft">Draft (hidden from storefront)</option>
              <option value="archived">Archived</option>
              <option value="expired">Expired</option>
            </select>
          </Field>
          <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-text-secondary">
            <input type="checkbox" name="featured" defaultChecked={bundle?.featured} className="h-4 w-4 accent-accent-cyan" />
            Featured on homepage
          </label>
        </div>
      </Section>

      <div className="flex justify-end gap-3 border-t border-border-glass pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/bundles")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "Saving..." : bundle ? "Save changes" : "Create bundle"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </h3>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      {children}
      {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
