import { createBrowserClient } from "@supabase/ssr";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";

/**
 * Supabase client for use in Client Components.
 * Uses only the public URL + anon key — safe to ship to the browser.
 * The anon key is useless for writes because Row Level Security policies
 * (see supabase/schema.sql) restrict writes to authenticated admins.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: supabaseCookieOptions }
  );
}
