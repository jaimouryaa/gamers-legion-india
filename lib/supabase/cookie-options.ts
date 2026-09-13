// @supabase/ssr defaults the cookie's `Secure` attribute based on
// NODE_ENV === 'production', not on whether the connection is actually
// HTTPS. That's correct on Vercel (always HTTPS) but wrong for testing a
// local production build (`next start`) over plain http://localhost — the
// browser silently drops a Secure-flagged cookie sent over http, so the
// session never persists and every request looks logged-out. Vercel always
// sets the VERCEL env var, so use that as the real signal instead.
export const supabaseCookieOptions = {
  secure: typeof process !== "undefined" && !!process.env.VERCEL,
};
