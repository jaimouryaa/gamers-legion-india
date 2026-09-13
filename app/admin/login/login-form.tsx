"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInAction, type AuthState } from "@/app/admin/login/actions";

const initialState: AuthState = null;

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <div className="glass-panel w-full max-w-sm rounded-3xl p-8">
      <div className="mb-7 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet font-display text-base font-bold text-[#fdf1f3]">
          GL
        </span>
        <h1 className="mt-4 font-display text-lg font-semibold text-text-primary">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-text-muted">Gamers Legion India dashboard</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" placeholder="••••••••" />

        {state?.error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <Button type="submit" disabled={pending} className="mt-2 w-full" size="lg">
          {pending && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        autoComplete={type === "password" ? "current-password" : "email"}
        className="h-11 rounded-xl border border-border-glass-strong bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan/60 focus:outline-none"
      />
    </label>
  );
}
