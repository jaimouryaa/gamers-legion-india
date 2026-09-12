import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { signOut } from "@/app/admin/login/actions";

export const metadata: Metadata = { title: "Access denied", robots: { index: false } };

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-4 text-center">
      <div className="absolute inset-0 grid-atmosphere" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/15 text-danger">
        <ShieldAlert size={24} />
      </div>
      <h1 className="relative font-display text-2xl font-semibold text-text-primary">Access denied</h1>
      <p className="relative max-w-sm text-text-muted">
        You don&apos;t have permission to access the admin dashboard. If you believe this is a
        mistake, ask an existing administrator to grant your account access.
      </p>
      <div className="relative flex gap-3">
        <Link href="/" className="text-sm font-medium text-accent-primary hover:underline">
          Back to site
        </Link>
        <form action={signOut}>
          <button type="submit" className="text-sm font-medium text-text-muted hover:text-text-primary">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
