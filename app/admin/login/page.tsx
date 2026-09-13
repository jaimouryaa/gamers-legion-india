import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // A single, one-way check done once when this page renders — not a
  // competing rule against the proxy's own check, so it can't create the
  // /admin <-> /admin/login ping-pong that having redirects in both places
  // caused before. Worst case if this check is ever stale: the user just
  // sees the login form and can sign in again.
  const profile = await getCurrentProfile();
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4">
      <div className="absolute inset-0 grid-atmosphere" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-accent-secondary/15 blur-[110px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent-violet/15 blur-[110px]" />
      <Suspense>
        <div className="relative">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
