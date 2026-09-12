# Gamers Legion India

A premium, dark (or light) gaming marketplace storefront with a secured admin CMS, built with
Next.js, TypeScript, Tailwind CSS, Framer Motion and Supabase.

> "Buy" doesn't run real payments in this version — it opens WhatsApp with a pre-filled message
> to a store number you configure, per the current scope. Swap in a real payment provider later
> without touching the storefront UI (see `lib/utils.ts` → `buildWhatsAppLink` /
> `buildWhatsAppCartLink`).

## Features

- **Storefront** — cinematic hero, animated stats, trust strip, featured games, full
  search/filter/sort catalog, game detail modal + dedicated `/games/[slug]` SEO pages,
  limited-time deals with live countdowns, recently added, promo banner, cart drawer with
  WhatsApp checkout, light/dark/system theme toggle.
- **Admin dashboard** (`/admin`) — Supabase-authenticated, server-verified admin role, KPI
  cards, games table (search/filter/paginate, feature toggle, archive, delete with confirm
  dialogs), add/edit game form with auto-calculated discount % and savings.
- **Security** — Row Level Security on every table, admin role checked server-side on every
  page *and* every Server Action (never trusts the client), no secrets shipped to the browser.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase (Postgres, Auth,
Storage) · Zod · Server Actions for forms · Sonner (toasts) · lucide-react

## 1. Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site works out of the box with **demo data** (`lib/data/fallback-games.ts`) even before you
connect Supabase, so you always have something to look at. Nothing in `/admin` will work until
Supabase is connected, though — that's the whole point.

## 2. Create a Supabase project (walkthrough)

1. Go to **supabase.com** → sign in → **New project**.
2. Pick an organization, name it (e.g. `gamers-legion-india`), set a database password (save
   it somewhere), pick a region close to your users, and click **Create new project**. Wait
   ~2 minutes for provisioning.
3. In the left sidebar go to **Project Settings -> API**. Copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key -> `SUPABASE_SERVICE_ROLE_KEY` (keep this one secret — never put it
     in a `NEXT_PUBLIC_` variable or commit it)
4. Paste all three into `.env.local`.

## 3. Run the database schema

1. In Supabase, open **SQL Editor -> New query**.
2. Paste the entire contents of `supabase/schema.sql` and click **Run**. This creates:
   - `profiles` (extends Supabase Auth users with a `role`: `user` | `admin`)
   - `games` (with RLS: public can only read `status = 'active'`, only admins can write)
   - a `games` storage bucket for cover/banner images
   - a trigger that auto-computes `discount_percentage` / `savings` on every insert/update
3. (Optional but recommended) Run `supabase/seed.sql` in the same SQL Editor to populate the
   catalog with realistic demo listings (titles used for demo purposes only — cover art is
   generated placeholder art, not real box art).

## 4. Create your admin account

1. Restart the dev server so it picks up `.env.local`: `npm run dev`.
2. Go to `http://localhost:3000/admin` — you'll be redirected to `/admin/login`.
3. Click **"Need an account? Sign up"**, fill in your email/password, and submit. New accounts
   always start with role `user` — this is enforced by the database, not the app, so it can't
   be bypassed from the browser.
4. Back in Supabase's **SQL Editor**, open `supabase/promote-to-admin.sql`, replace
   `you@example.com` with the email you just signed up with, and run it.
5. Go back to `/admin/login` and sign in. You now have full admin access.

You can repeat step 4 for any teammate's email to grant them admin access — there's no
separate "invite" flow in this version.

## 5. Configure WhatsApp checkout

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` to your store's WhatsApp number in
international format, no `+`, spaces or dashes — e.g. `919876543210` for an Indian number.
"Add to cart -> Checkout on WhatsApp" and "Buy via WhatsApp" both build a `wa.me` link with a
pre-filled message listing the game(s) and price.

## Environment variables

See `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-only admin tooling (nothing currently
reads it — all writes go through the anon key + RLS). Never expose it to the client if you do
start using it.

## Database schema

| Table      | Purpose                                                                |
|------------|--------------------------------------------------------------------------|
| `profiles` | Mirrors `auth.users`, adds a `role` (`user`/`admin`) column              |
| `games`    | The catalog — title, pricing, genre/platforms, status, featured, etc.    |

RLS policies (in `supabase/schema.sql`):
- Anyone can `select` games where `status = 'active'`.
- Only rows in `profiles` with `role = 'admin'` can `insert`/`update`/`delete` games, or read
  non-active games (drafts, archived, expired).
- Storage bucket `games` is publicly readable; only admins can upload/update/delete files in it.

## Project structure

```
app/
  (public)/             storefront routes — /, /games, /games/[slug], /deals, /about
  admin/
    login/               admin sign in / sign up
    unauthorized/        shown to authenticated non-admins
    (protected)/         everything behind requireAdmin(): dashboard, games CRUD
components/
  ui/                    generic building blocks (button, badge, price, rating, cover art...)
  site/                  storefront sections (navbar, hero, game cards, cart, modal...)
  admin/                 admin shell, sidebar, KPI cards, confirm dialogs
lib/
  supabase/              browser/server Supabase clients + session-refresh proxy helper
  auth/require-admin.ts   server-side admin gate, used in every protected page/action
  queries/games.ts        all game reads, with graceful fallback to demo data
  validation/              Zod schemas for admin forms
  theme-store.ts           light/dark/system theme, persisted + no-flash
  cart-store.ts            client-side cart, persisted to localStorage
  data/fallback-games.ts   demo data used only when Supabase isn't configured yet
supabase/
  schema.sql              run this first
  seed.sql                 optional demo catalog
  promote-to-admin.sql     run after your first signup to become admin
proxy.ts                  Next.js 16 proxy (formerly "middleware") — refreshes the auth
                           session and protects /admin/* routes
```

## Commands

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # ESLint
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project** -> import the repo.
3. Add the environment variables from `.env.example` in Vercel's Project Settings ->
   Environment Variables (use your real Supabase project's values, and set
   `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. No other configuration is required — the production build doesn't depend on any
   local-only setup.

## What's intentionally not built yet

This is scoped as an MVP first pass:
- Bundles, promotions-as-a-managed-entity, and categories tables/admin screens are designed for
  in the original brief but not yet implemented — `games` and the games CRUD are fully wired,
  as agreed for this pass.
- Real payment processing (WhatsApp hand-off is used instead, by request).
- User-facing accounts/order history.

The architecture (RLS-first Supabase schema, Server Actions with server-side re-authorization,
typed queries with a mapper layer) is set up so those can be added the same way `games` was,
without restructuring anything.
