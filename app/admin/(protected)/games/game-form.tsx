"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GENRES, PLATFORMS, type Game } from "@/lib/types";
import { calcDiscount, formatINR } from "@/lib/utils";
import type { FormState } from "@/app/admin/(protected)/games/actions";

export function GameForm({
  game,
  action,
}: {
  game?: Game;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [originalPrice, setOriginalPrice] = useState(game?.originalPrice ?? 0);
  const [salePrice, setSalePrice] = useState(game?.salePrice ?? 0);

  const { savings, discountPercentage } = useMemo(
    () => calcDiscount(Number(originalPrice) || 0, Number(salePrice) || 0),
    [originalPrice, salePrice]
  );

  // Show a toast once the server action resolves successfully (state resets
  // to null on redirect-free success) — for edit specifically we detect
  // "no error" after a submit via the pending transition.
  const err = state?.error;
  const fieldErrors = state?.fieldErrors ?? {};

  async function handleSubmit(formData: FormData) {
    const result = await formAction(formData);
    // useActionState already updates `state`; this wrapper lets us toast.
    return result;
  }

  return (
    <form
      action={async (formData) => {
        await handleSubmit(formData);
        if (!state?.error) {
          toast.success(game ? "Game updated successfully." : "Game created successfully.");
          router.push("/admin/games");
          router.refresh();
        }
      }}
      className="flex flex-col gap-8"
    >
      {err && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {err}
        </div>
      )}

      <Section title="Basic information">
        <Field label="Game title" error={fieldErrors.title}>
          <input name="title" defaultValue={game?.title} required className="input" />
        </Field>
        <Field label="Short description" error={fieldErrors.shortDescription} hint="Shown on cards, up to 160 characters">
          <input name="shortDescription" defaultValue={game?.shortDescription ?? ""} maxLength={160} className="input" />
        </Field>
        <Field label="Full description" error={fieldErrors.description}>
          <textarea name="description" defaultValue={game?.description} required rows={4} className="input resize-none" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Cover image URL" error={fieldErrors.coverImage} hint="Optional — placeholder art used if empty">
            <input name="coverImage" type="url" defaultValue={game?.coverImage ?? ""} className="input" />
          </Field>
          <Field label="Banner image URL" error={fieldErrors.bannerImage}>
            <input name="bannerImage" type="url" defaultValue={game?.bannerImage ?? ""} className="input" />
          </Field>
        </div>
      </Section>

      <Section title="Classification">
        <Field label="Genres" error={fieldErrors.genre}>
          <CheckboxGroup name="genre" options={GENRES} defaultValues={game?.genre ?? []} />
        </Field>
        <Field label="Platforms" error={fieldErrors.platforms}>
          <CheckboxGroup name="platforms" options={PLATFORMS} defaultValues={game?.platforms ?? []} />
        </Field>
        <Field label="Tags" hint="Comma separated, e.g. open-world, co-op">
          <input name="tags" defaultValue={game?.tags?.join(", ") ?? ""} className="input" />
        </Field>
      </Section>

      <Section title="Pricing">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Original price (₹)" error={fieldErrors.originalPrice}>
            <input
              name="originalPrice"
              type="number"
              min={0}
              step="1"
              defaultValue={game?.originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              required
              className="input"
            />
          </Field>
          <Field label="Sale price (₹)" error={fieldErrors.salePrice}>
            <input
              name="salePrice"
              type="number"
              min={0}
              step="1"
              defaultValue={game?.salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              required
              className="input"
            />
          </Field>
        </div>
        <div className="flex items-center gap-6 rounded-xl border border-border-glass bg-surface/60 px-4 py-3 text-sm">
          <span className="text-text-muted">
            Discount: <span className="font-semibold text-accent-primary">{discountPercentage}% OFF</span>
          </span>
          <span className="text-text-muted">
            Savings: <span className="font-semibold text-success">{formatINR(savings)}</span>
          </span>
        </div>
      </Section>

      <Section title="Ratings & availability">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Rating (0–5)">
            <input name="rating" type="number" min={0} max={5} step="0.1" defaultValue={game?.rating ?? ""} className="input" />
          </Field>
          <Field label="Review count">
            <input name="reviewCount" type="number" min={0} defaultValue={game?.reviewCount ?? ""} className="input" />
          </Field>
          <Field label="Release date">
            <input name="releaseDate" type="date" defaultValue={game?.releaseDate ?? ""} className="input" />
          </Field>
          <Field label="Deal expiry" hint="Leave empty for no countdown">
            <input
              name="dealExpiry"
              type="datetime-local"
              defaultValue={game?.dealExpiry ? game.dealExpiry.slice(0, 16) : ""}
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select name="status" defaultValue={game?.status ?? "draft"} className="input">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="expired">Expired</option>
            </select>
          </Field>
          <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-text-secondary">
            <input type="checkbox" name="featured" defaultChecked={game?.featured} className="h-4 w-4 accent-accent-primary" />
            Featured on homepage
          </label>
        </div>
      </Section>

      <div className="flex justify-end gap-3 border-t border-border-glass pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/games")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "Saving..." : game ? "Save changes" : "Create game"}
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

function CheckboxGroup({
  name,
  options,
  defaultValues,
}: {
  name: string;
  options: readonly string[];
  defaultValues: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2 rounded-full border border-border-glass px-3 py-1.5 text-xs text-text-secondary has-checked:border-accent-primary/60 has-checked:text-accent-primary has-checked:bg-accent-primary/10"
        >
          <input
            type="checkbox"
            name={name}
            value={opt}
            defaultChecked={defaultValues.includes(opt)}
            className="sr-only"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
