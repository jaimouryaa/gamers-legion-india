import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
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
          console.log("🔍 DEBUG server setAll — cookie names:", cookiesToSet.map(c => c.name));
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
    }
  );
}

/**
 * Service-role client — bypasses RLS. Use ONLY for server-side operations
 * where you have already verified the user's identity via getUser().
 * Never expose this client or its key to the browser.
 */
function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Returns the current authenticated user's profile (with role), or null.
 * Identity is verified via getUser() (validates JWT with Supabase Auth server),
 * then the profile row is fetched with the service-role client to avoid RLS
 * silently blocking the read when the anon-key session isn't forwarded correctly.
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Use the admin client so RLS on `profiles` never blocks this server-side read.
  // The user's identity has already been verified above via getUser().
  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", user.id)
    .single();

  console.log("🔍 DEBUG getCurrentProfile — user.id:", user.id, "profile:", profile, "error:", profileError?.message, profileError?.code);

  return profile ?? null;
}