"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import type { Game } from "@/lib/types";
import type { ProofFormState } from "@/app/admin/(protected)/proofs/actions";

export function ProofForm({
  games,
  action,
}: {
  games: Game[];
  action: (prev: ProofFormState, formData: FormData) => Promise<ProofFormState>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const fieldErrors = state?.fieldErrors ?? {};

  // Same reliable pattern used in the game form: react to `pending`
  // flipping true -> false, not to `state` read inside the submit
  // handler itself (which would be a stale, pre-submission value).
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending) {
      if (!state?.error) {
        toast.success("Proof added successfully.");
        router.push("/admin/proofs");
        router.refresh();
      }
    }
    wasPending.current = pending;
  }, [pending, state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {state.error}
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col gap-5">
          <div>
            <MediaUploadField name="imageUrl" label="Screenshot" kind="covers" />
            {fieldErrors.imageUrl && (
              <p className="mt-1.5 text-xs text-danger">{fieldErrors.imageUrl}</p>
            )}
            <p className="mt-1.5 text-xs text-text-muted">
              Crop or blur out any customer name, phone number, or payment details before
              uploading — this will be shown publicly.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Caption <span className="text-text-muted">(optional)</span>
            </label>
            <input
              name="caption"
              placeholder="e.g. Delivered within 10 minutes of payment"
              maxLength={200}
              className="input"
            />
            {fieldErrors.caption && <p className="text-xs text-danger">{fieldErrors.caption}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Related game <span className="text-text-muted">(optional)</span>
            </label>
            <select name="gameId" defaultValue="" className="input">
              <option value="">Not tied to a specific game</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-text-secondary">
            <input
              type="checkbox"
              name="published"
              defaultChecked
              className="h-4 w-4 accent-accent-cyan"
            />
            Published (visible on the public /proof page immediately)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border-glass pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/proofs")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "Saving..." : "Add proof"}
        </Button>
      </div>
    </form>
  );
}
