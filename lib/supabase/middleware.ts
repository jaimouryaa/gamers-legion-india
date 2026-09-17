import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";

  // Only /admin/* routes need an auth check at all — the entire public
  // storefront (homepage, catalog, deals, bundles, every prefetch Next.js
  // fires for footer/nav links) was previously paying for a live network
  // round-trip to Supabase's Auth API on EVERY request regardless, adding
  // ~150-250ms of pure latency to pages that never needed it. Skipping the
  // Supabase call entirely for non-admin routes removes that cost.
  if (!isAdminRoute) {
    return response;
  }

  let mutableResponse = response;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          mutableResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            mutableResponse.cookies.set(name, value, options)
          );
        },
      },
      cookieOptions: supabaseCookieOptions,
    }
  );

  // IMPORTANT: getUser() (not getSession()) re-validates the token against
  // Supabase Auth on every request instead of trusting a local cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only ever redirect in ONE direction here: unauthenticated users away
  // from protected routes. We deliberately do NOT also redirect logged-in
  // users away from /admin/login — each of those checks is a separate,
  // independent network call to Supabase, and if they ever briefly
  // disagree (a network blip, a rate limit, anything), redirecting in both
  // directions creates an infinite /admin <-> /admin/login loop. Landing
  // an already-logged-in admin on the login page is harmless; this isn't.
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return mutableResponse;
}
