"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInAction, signUpAction, type AuthState } from "@/app/admin/login/actions";

const initialState: AuthState = null;

export function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction, initialState);

  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;
  const action = mode === "signin" ? signInFormAction : signUpFormAction;

  return (
    <div className="glass-panel w-full max-w-sm rounded-3xl p-8">
      <div className="mb-7 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-violet font-display text-base font-bold text-[#fdf1f3]">
          GL
        </span>
        <h1 className="mt-4 font-display text-lg font-semibold text-text-primary">
          {mode === "signin" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-1 text-sm text-text-muted">Gamers Legion India dashboard</p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        {mode === "signup" && (
          <Field label="Full name" name="fullName" type="text" placeholder="Your name" required={false} />
        )}
        <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Field label="Password" name="password" type="password" placeholder="••••••••" required />

        {state?.error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}
        {state?.success && (
          <div className="flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm text-success">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            <span>{state.success}</span>
          </div>
        )}

        <Button type="submit" disabled={pending} className="mt-2 w-full" size="lg">
          {pending && <Loader2 size={16} className="animate-spin" />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-5 w-full text-center text-sm text-text-muted hover:text-accent-primary"
      >
        {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-11 rounded-xl border border-border-glass-strong bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
      />
    </label>
  );
}
