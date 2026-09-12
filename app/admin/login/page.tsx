import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
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
