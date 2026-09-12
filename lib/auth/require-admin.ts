import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";

/**
 * Server-side gate for anything admin-only. Always checks the `role` column
 * in the database (via RLS-protected `profiles` table) rather than trusting
 * anything the client sends. Use this at the top of every admin page and
 * every admin server action — not just the layout — because Server Actions
 * can be invoked directly and must not rely on layout checks alone.
 */
export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/admin/login");
  }
  if (profile.role !== "admin") {
    redirect("/admin/unauthorized");
  }
  return profile;
}
