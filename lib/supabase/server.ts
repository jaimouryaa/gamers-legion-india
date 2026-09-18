import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Reads/writes the user's session from cookies so RLS policies evaluate
 * `auth.uid()` correctly on the server.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no cookie-write access.
            // Safe to ignore because middleware refreshes the session.
          }
        },
      },
      cookieOptions: supabaseCookieOptions,
      auth: {
        // This client is created fresh per request in a stateless server
        // environment (Server Components/Actions) — there's no long-lived
        // process for a background token-refresh timer to run in, and one
        // isn't needed: the proxy already does an explicit, one-time
        // getUser() revalidation for admin routes. Without this, the
        // client's default auto-refresh behavior fires on creation and,
        // if a stale/invalid refresh token is sitting in cookies (e.g.
        // from an account that no longer exists), logs a noisy
        // "Invalid Refresh Token" AuthApiError on every request — even
        // ones that never call getUser() themselves.
        //
        // persistSession is deliberately left at its default (true) —
        // that's what makes this client read the existing session from
        // our custom cookie storage adapter above, which admin auth
        // depends on. Only the background auto-refresh timer is disabled.
        autoRefreshToken: false,
      },
    }
  );
}

/**
 * Returns the current authenticated user's profile (with role), or null.
 * This is the single source of truth for "is this person an admin" —
 * it is checked server-side against the database, never trusted from the client.
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", user.id)
    .single();

  return profile ?? null;
}
